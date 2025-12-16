const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Import Gemini AI
let genAI, model;
try {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
} catch (error) {
  console.log('Gemini AI not configured');
}

// Helper function to calculate text similarity (cosine similarity with TF-IDF)
function calculateSimilarity(text1, text2) {
  // Simple word-based similarity (can be enhanced with NLP libraries)
  const words1 = text1.toLowerCase().split(/\W+/).filter(w => w.length > 3);
  const words2 = text2.toLowerCase().split(/\W+/).filter(w => w.length > 3);
  
  const set1 = new Set(words1);
  const set2 = new Set(words2);
  
  const intersection = [...set1].filter(word => set2.has(word)).length;
  const union = new Set([...set1, ...set2]).size;
  
  return union > 0 ? intersection / union : 0;
}

// Helper function to determine clone type
function determineCloneType(similarity, job1, job2) {
  const sameCompany = job1.company.toLowerCase() === job2.company.toLowerCase();
  const sameTitle = job1.position.toLowerCase() === job2.position.toLowerCase();
  
  if (similarity >= 0.95 && sameCompany && sameTitle) {
    return 'exact_repost';
  } else if (similarity >= 0.85 && !sameCompany) {
    return 'content_clone'; // Likely scam
  } else if (similarity >= 0.70 && sameTitle && !sameCompany) {
    return 'recruiter_clone'; // Different recruiters for same job
  } else if (similarity >= 0.90) {
    return 'scam'; // Very similar but suspicious
  }
  
  return null;
}

// ===========================
// SCAN FOR CLONES
// ===========================
router.get('/scan', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user's bookmarked jobs and applications
    const [bookmarkedJobs, applications] = await Promise.all([
      prisma.jobBookmark.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.application.findMany({
        where: { userId },
        select: {
          id: true,
          company: true,
          position: true,
          jobDescription: true,
          jobUrl: true,
          dateApplied: true
        }
      })
    ]);
    
    // Combine all jobs for analysis
    const allJobs = [
      ...bookmarkedJobs.map(b => ({
        id: `bookmark_${b.id}`,
        company: b.company,
        position: b.position,
        description: b.jobDescription || '',
        url: b.jobUrl,
        date: b.createdAt,
        type: 'bookmark'
      })),
      ...applications.map(a => ({
        id: `application_${a.id}`,
        company: a.company,
        position: a.position,
        description: a.jobDescription || '',
        url: a.jobUrl,
        date: a.dateApplied,
        type: 'application'
      }))
    ];
    
    // Find potential clones
    const detectedClones = [];
    const processedPairs = new Set();
    
    for (let i = 0; i < allJobs.length; i++) {
      for (let j = i + 1; j < allJobs.length; j++) {
        const job1 = allJobs[i];
        const job2 = allJobs[j];
        
        const pairKey = [job1.id, job2.id].sort().join('_');
        if (processedPairs.has(pairKey)) continue;
        processedPairs.add(pairKey);
        
        // Calculate similarity
        const titleSimilarity = calculateSimilarity(job1.position, job2.position);
        const descSimilarity = calculateSimilarity(
          job1.description || job1.position,
          job2.description || job2.position
        );
        const overallSimilarity = (titleSimilarity * 0.4 + descSimilarity * 0.6);
        
        if (overallSimilarity >= 0.70) {
          const cloneType = determineCloneType(overallSimilarity, job1, job2);
          
          if (cloneType) {
            // Check if already recorded
            const existing = await prisma.jobClone.findFirst({
              where: {
                userId,
                OR: [
                  { originalJobId: job1.id, cloneJobId: job2.id },
                  { originalJobId: job2.id, cloneJobId: job1.id }
                ]
              }
            });
            
            if (!existing) {
              const clone = await prisma.jobClone.create({
                data: {
                  userId,
                  originalJobId: job1.id,
                  cloneJobId: job2.id,
                  cloneType,
                  similarity: overallSimilarity,
                  originalCompany: job1.company,
                  cloneCompany: job2.company,
                  originalTitle: job1.position,
                  cloneTitle: job2.position,
                  isHidden: false
                }
              });
              
              detectedClones.push({
                ...clone,
                job1: {
                  company: job1.company,
                  position: job1.position,
                  date: job1.date
                },
                job2: {
                  company: job2.company,
                  position: job2.position,
                  date: job2.date
                }
              });
            }
          }
        }
      }
    }
    
    // Get existing clones
    const existingClones = await prisma.jobClone.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    
    // Calculate stats
    const stats = {
      totalScanned: allJobs.length,
      duplicatesFound: existingClones.length,
      exactReposts: existingClones.filter(c => c.cloneType === 'exact_repost').length,
      contentClones: existingClones.filter(c => c.cloneType === 'content_clone').length,
      recruiterClones: existingClones.filter(c => c.cloneType === 'recruiter_clone').length,
      scams: existingClones.filter(c => c.cloneType === 'scam').length,
      timeSavedHours: Math.round(existingClones.length * 0.5) // ~30 min per duplicate
    };
    
    res.json({
      success: true,
      newClones: detectedClones,
      allClones: existingClones,
      stats
    });
    
  } catch (error) {
    console.error('Error scanning for clones:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to scan for job clones'
    });
  }
});

// ===========================
// MARK AS DUPLICATE/HIDE
// ===========================
router.post('/mark-duplicate', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { cloneId, action } = req.body; // action: 'hide' or 'unhide'
    
    const clone = await prisma.jobClone.update({
      where: { id: cloneId },
      data: { isHidden: action === 'hide' }
    });
    
    res.json({
      success: true,
      clone
    });
    
  } catch (error) {
    console.error('Error marking duplicate:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update clone status'
    });
  }
});

// ===========================
// BLACKLIST COMPANY
// ===========================
router.post('/blacklist', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { companyName, reason } = req.body;
    
    // Check if already blacklisted
    const existing = await prisma.companyBlacklist.findUnique({
      where: {
        userId_companyName: {
          userId,
          companyName
        }
      }
    });
    
    if (existing) {
      // Update blocked count
      const updated = await prisma.companyBlacklist.update({
        where: { id: existing.id },
        data: { blockedCount: existing.blockedCount + 1 }
      });
      
      res.json({
        success: true,
        blacklist: updated,
        message: 'Company already blacklisted, count updated'
      });
    } else {
      // Create new blacklist entry
      const blacklist = await prisma.companyBlacklist.create({
        data: {
          userId,
          companyName,
          reason,
          blockedCount: 1
        }
      });
      
      res.json({
        success: true,
        blacklist,
        message: 'Company blacklisted successfully'
      });
    }
    
  } catch (error) {
    console.error('Error blacklisting company:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to blacklist company'
    });
  }
});

// ===========================
// GET BLACKLIST
// ===========================
router.get('/blacklist', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const blacklist = await prisma.companyBlacklist.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({
      success: true,
      blacklist
    });
    
  } catch (error) {
    console.error('Error fetching blacklist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch blacklist'
    });
  }
});

// ===========================
// REMOVE FROM BLACKLIST
// ===========================
router.delete('/blacklist/:id', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    await prisma.companyBlacklist.delete({
      where: {
        id,
        userId // Ensure user owns this blacklist entry
      }
    });
    
    res.json({
      success: true,
      message: 'Company removed from blacklist'
    });
    
  } catch (error) {
    console.error('Error removing from blacklist:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove from blacklist'
    });
  }
});

// ===========================
// GET CLONE GROUPS
// ===========================
router.get('/groups', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    
    const clones = await prisma.jobClone.findMany({
      where: { userId },
      orderBy: { similarity: 'desc' }
    });
    
    // Group clones by similarity and companies
    const groups = {};
    
    clones.forEach(clone => {
      const key = `${clone.originalCompany}_${clone.cloneCompany}`.toLowerCase();
      if (!groups[key]) {
        groups[key] = {
          companies: [clone.originalCompany, clone.cloneCompany],
          clones: [],
          totalSimilarity: 0,
          count: 0
        };
      }
      groups[key].clones.push(clone);
      groups[key].totalSimilarity += clone.similarity;
      groups[key].count++;
    });
    
    // Convert to array and calculate average similarity
    const groupsArray = Object.values(groups).map(g => ({
      ...g,
      avgSimilarity: g.totalSimilarity / g.count
    }));
    
    res.json({
      success: true,
      groups: groupsArray
    });
    
  } catch (error) {
    console.error('Error fetching clone groups:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch clone groups'
    });
  }
});

module.exports = router;
