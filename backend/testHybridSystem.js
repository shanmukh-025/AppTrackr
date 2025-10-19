/**
 * Test Hybrid Career Page System
 * Tests all three tiers of the caching system
 */

const { findCompanyCareerPage } = require('./utils/companyCareerPages');
const prisma = require('./prisma/client');

async function testHybridSystem() {
  console.log('🧪 Testing Hybrid Career Page System\n');
  console.log('='.repeat(60));
  
  // TEST 1: Static Database (Tier 1)
  console.log('\n📋 TEST 1: Static Database Lookup (Tier 1)');
  console.log('-'.repeat(60));
  const tier1Result = await findCompanyCareerPage('Google');
  console.log(`✅ Google URL: ${tier1Result}`);
  console.log('Expected: Instant lookup from static database\n');
  
  // TEST 2: Learning Cache (Tier 2) - Search multiple times
  console.log('\n📋 TEST 2: Learning Cache (Tier 2)');
  console.log('-'.repeat(60));
  console.log('Searching for "Stripe" 4 times to trigger auto-save...\n');
  
  for (let i = 1; i <= 4; i++) {
    console.log(`Search ${i}/4:`);
    const result = await findCompanyCareerPage('Stripe');
    console.log(`  URL: ${result}\n`);
    
    if (i === 3) {
      console.log('  ⏳ Should save to database after this search...\n');
    }
  }
  
  // Verify it was saved
  const stripeInDb = await prisma.companyCareerPage.findUnique({
    where: { companyName: 'stripe' }
  });
  
  if (stripeInDb) {
    console.log(`✅ SUCCESS: Stripe saved to database!`);
    console.log(`   - Search Count: ${stripeInDb.searchCount}`);
    console.log(`   - Source: ${stripeInDb.source}`);
    console.log(`   - URL: ${stripeInDb.careerUrl}\n`);
  } else {
    console.log('❌ FAILED: Stripe not saved to database\n');
  }
  
  // TEST 3: Real-time Generation (Tier 3)
  console.log('\n📋 TEST 3: Real-time Generation (Tier 3)');
  console.log('-'.repeat(60));
  const tier3Result = await findCompanyCareerPage('Random Startup Inc');
  console.log(`✅ Random Startup URL: ${tier3Result}`);
  console.log('Expected: Generated on-the-fly, NOT saved to database\n');
  
  // Verify it was NOT saved
  const randomInDb = await prisma.companyCareerPage.findUnique({
    where: { companyName: 'random startup' }
  });
  
  if (!randomInDb) {
    console.log('✅ SUCCESS: Random company NOT saved (as expected)\n');
  } else {
    console.log('❌ UNEXPECTED: Random company was saved to database\n');
  }
  
  // TEST 4: Database Statistics
  console.log('\n📊 Database Statistics');
  console.log('='.repeat(60));
  
  const stats = await prisma.companyCareerPage.groupBy({
    by: ['source'],
    _count: true
  });
  
  console.log('Companies by source:');
  stats.forEach(stat => {
    console.log(`  - ${stat.source}: ${stat._count} companies`);
  });
  
  const total = await prisma.companyCareerPage.count();
  console.log(`\n📈 Total companies in database: ${total}`);
  
  // Estimate storage
  const avgSize = 171; // bytes per record
  const totalSize = total * avgSize;
  const sizeKB = (totalSize / 1024).toFixed(2);
  console.log(`💾 Estimated storage: ${sizeKB} KB`);
  console.log(`📊 Percentage of 1GB database: ${(totalSize / (1024 * 1024 * 1024) * 100).toFixed(4)}%\n`);
  
  console.log('='.repeat(60));
  console.log('✅ All tests completed!\n');
  
  await prisma.$disconnect();
}

// Run tests
testHybridSystem().catch(error => {
  console.error('❌ Test failed:', error);
  process.exit(1);
});
