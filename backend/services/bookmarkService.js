const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Add a job to user's bookmarks
async function bookmarkJob(userId, jobData) {
  try {
    // Check if already bookmarked
    const existing = await prisma.jobBookmark.findUnique({
      where: {
        userId_jobUrl: {
          userId,
          jobUrl: jobData.jobUrl,
        },
      },
    });

    if (existing) {
      return { 
        success: false, 
        message: 'Job already bookmarked',
        bookmark: existing
      };
    }

    const bookmark = await prisma.jobBookmark.create({
      data: {
        userId,
        company: jobData.company,
        position: jobData.position,
        jobUrl: jobData.jobUrl,
        logoUrl: jobData.logoUrl || null,
        salaryRange: jobData.salaryRange || null,
        location: jobData.location || null,
        jobDescription: jobData.jobDescription || null,
      },
    });

    return { 
      success: true, 
      message: 'Job bookmarked successfully',
      bookmark
    };
  } catch (error) {
    console.error('Error bookmarking job:', error);
    throw error;
  }
}

// Remove bookmark
async function removeBookmark(userId, jobUrl) {
  try {
    const bookmark = await prisma.jobBookmark.findUnique({
      where: {
        userId_jobUrl: {
          userId,
          jobUrl,
        },
      },
    });

    if (!bookmark) {
      return { 
        success: false, 
        message: 'Bookmark not found'
      };
    }

    await prisma.jobBookmark.delete({
      where: {
        id: bookmark.id,
      },
    });

    return { 
      success: true, 
      message: 'Bookmark removed successfully'
    };
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw error;
  }
}

// Get all bookmarks for user
async function getUserBookmarks(userId, options = {}) {
  try {
    const { sortBy = 'createdAt', order = 'desc', limit = 50, skip = 0 } = options;

    const bookmarks = await prisma.jobBookmark.findMany({
      where: { userId },
      orderBy: { [sortBy]: order },
      take: limit,
      skip,
    });

    const total = await prisma.jobBookmark.count({
      where: { userId },
    });

    return {
      success: true,
      bookmarks,
      pagination: {
        total,
        limit,
        skip,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error getting bookmarks:', error);
    throw error;
  }
}

// Check if job is bookmarked
async function isJobBookmarked(userId, jobUrl) {
  try {
    const bookmark = await prisma.jobBookmark.findUnique({
      where: {
        userId_jobUrl: {
          userId,
          jobUrl,
        },
      },
    });

    return { 
      success: true, 
      isBookmarked: !!bookmark 
    };
  } catch (error) {
    console.error('Error checking bookmark:', error);
    throw error;
  }
}

// Toggle bookmark
async function toggleBookmark(userId, jobData) {
  try {
    const isBookmarked = await isJobBookmarked(userId, jobData.jobUrl);
    
    if (isBookmarked.isBookmarked) {
      return removeBookmark(userId, jobData.jobUrl);
    } else {
      return bookmarkJob(userId, jobData);
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error);
    throw error;
  }
}

// Get bookmark count for user
async function getBookmarkCount(userId) {
  try {
    const count = await prisma.jobBookmark.count({
      where: { userId },
    });

    return { 
      success: true, 
      count 
    };
  } catch (error) {
    console.error('Error getting bookmark count:', error);
    throw error;
  }
}

module.exports = {
  bookmarkJob,
  removeBookmark,
  getUserBookmarks,
  isJobBookmarked,
  toggleBookmark,
  getBookmarkCount,
};
