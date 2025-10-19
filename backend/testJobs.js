/**
 * Test Job Service
 * Run this to verify API integration works
 */

require('dotenv').config();
const jobService = require('./services/jobService');

async function testJobService() {
  console.log('\n🧪 Testing Job Service Integration\n');
  console.log('=' .repeat(60));

  try {
    // Test 1: Search for JavaScript jobs
    console.log('\n📝 Test 1: Searching for JavaScript jobs...\n');
    const skills1 = ['javascript', 'react'];
    const jobs1 = await jobService.searchJobs(skills1, { limit: 5 });
    console.log(`✅ Found ${jobs1.length} jobs`);
    if (jobs1.length > 0) {
      console.log(`\nSample job:`);
      console.log(`  Title: ${jobs1[0].title}`);
      console.log(`  Company: ${jobs1[0].company}`);
      console.log(`  Location: ${jobs1[0].location}`);
      console.log(`  Source: ${jobs1[0].source}`);
      console.log(`  Score: ${jobs1[0].relevanceScore}`);
    }

    // Test 2: Search for Python jobs
    console.log('\n' + '='.repeat(60));
    console.log('\n📝 Test 2: Searching for Python jobs...\n');
    const skills2 = ['python', 'django'];
    const jobs2 = await jobService.searchJobs(skills2, { limit: 5 });
    console.log(`✅ Found ${jobs2.length} jobs`);

    // Test 3: Check cache (should be instant)
    console.log('\n' + '='.repeat(60));
    console.log('\n📝 Test 3: Testing cache (repeating search)...\n');
    const startTime = Date.now();
    await jobService.searchJobs(skills1, { limit: 5 });
    const timeTaken = Date.now() - startTime;
    console.log(`✅ Cache test completed in ${timeTaken}ms`);
    console.log(`   ${timeTaken < 100 ? '✅ Cache is working!' : '⚠️  Cache might not be working'}`);

    // Test 4: Get stats
    console.log('\n' + '='.repeat(60));
    console.log('\n📝 Test 4: Checking API stats...\n');
    const stats = jobService.getStats();
    console.log('Rate Limits:');
    console.log(`  Jooble: ${stats.rateLimits.jooble.used}/${stats.rateLimits.jooble.limit} used`);
    console.log(`          ${stats.rateLimits.jooble.remaining} remaining`);
    console.log(`          Resets in ${stats.rateLimits.jooble.resetIn}`);
    console.log(`\n  APIJobs: ${stats.rateLimits.apijobs.used}/${stats.rateLimits.apijobs.limit} used`);
    console.log(`           ${stats.rateLimits.apijobs.remaining} remaining`);
    console.log(`           Resets in ${stats.rateLimits.apijobs.resetIn}`);
    console.log(`\nCache: ${stats.cache.size}/${stats.cache.maxSize} entries`);

    console.log('\n' + '='.repeat(60));
    console.log('\n✅ All tests completed successfully!\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error);
  }
}

// Run tests
testJobService();
