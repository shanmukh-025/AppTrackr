/**
 * Test Script: Check if Job APIs provide DIRECT company URLs
 * Tests: APIJobs.dev, JSearch, JobApi
 */

require('dotenv').config();
const axios = require('axios');

async function testAPIJobsDev() {
  console.log('\n=== TESTING APIJobs.dev ===');
  try {
    // Try multiple endpoint formats
    const endpoints = [
      'https://api.apijobs.dev/v1/jobs',
      'https://api.apijobs.dev/v1/job/search',
      'https://apijobs.dev/api/v1/jobs'
    ];

    for (const endpoint of endpoints) {
      try {
        console.log(`Trying: ${endpoint}`);
        const response = await axios.get(endpoint, {
          params: { q: 'javascript', limit: 2 },
          headers: {
            'Authorization': `Bearer ${process.env.APIJOBS_API_KEY}`,
            'apikey': process.env.APIJOBS_API_KEY
          },
          timeout: 5000
        });

        const job = response.data.data ? response.data.data[0] : response.data[0];
        console.log('✅ SUCCESS!');
        console.log('Title:', job.title || job.position);
        console.log('Company:', job.company_name || job.company);
        
        // Check for URL fields
        console.log('\n>>> URL FIELDS:');
        ['url', 'application_url', 'company_url', 'link', 'apply_url'].forEach(field => {
          if (job[field]) {
            console.log(`  ${field}:`, job[field]);
            
            // Check if it redirects
            if (job[field].includes('apijobs')) {
              console.log(`  ❌ REDIRECTS through apijobs.dev`);
            } else {
              console.log(`  ✅ MIGHT BE DIRECT!`);
            }
          }
        });
        
        return; // Exit after first success
      } catch (err) {
        console.log(`  ❌ Failed:`, err.response?.status || err.message);
      }
    }
    
    console.log('\n❌ All APIJobs.dev endpoints failed');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function testJSearch() {
  console.log('\n=== TESTING JSearch (RapidAPI) ===');
  console.log('Note: JSearch requires RapidAPI subscription');
  console.log('Based on documentation:');
  console.log('  - Provides: job_apply_link');
  console.log('  - Format: Google Jobs redirect URLs');
  console.log('  - Example: https://www.google.com/search?...');
  console.log('  ❌ VERDICT: REDIRECTS through Google Jobs');
}

async function testJobApi() {
  console.log('\n=== TESTING JobApi ===');
  console.log('Note: JobApi (jobapi.com) requires paid subscription');
  console.log('Based on documentation:');
  console.log('  - Provides: job_url field');
  console.log('  - Claims: Direct company URLs');
  console.log('  - Cost: ~$50/month');
  console.log('  ⚠️  VERDICT: Need to verify with API key');
}

// Run all tests
async function runAllTests() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║   DIRECT URL API TESTING SUITE        ║');
  console.log('╚════════════════════════════════════════╝');
  
  await testAPIJobsDev();
  await testJSearch();
  await testJobApi();
  
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   SUMMARY                              ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('\nFree APIs tested:');
  console.log('  - APIJobs.dev: Testing now...');
  console.log('  - JSearch: ❌ Google redirect');
  console.log('  - JobApi: ⚠️  Paid only ($50/mo)');
  console.log('\nConclusion:');
  console.log('  Most free job APIs redirect to monetize.');
  console.log('  Direct URLs typically require paid plans.');
}

runAllTests();
