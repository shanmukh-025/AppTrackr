/**
 * Test script to see what URL formats each API actually returns
 * Run: node testURLFormats.js
 */

const axios = require('axios');
require('dotenv').config();

async function testJoobleURLFormat() {
  console.log('\n🔍 Testing Jooble URL format...');
  try {
    const response = await axios.post('https://jooble.org/api/' + process.env.JOOBLE_API_KEY, {
      keywords: 'software engineer',
      location: 'remote',
      page: 1
    });
    
    if (response.data.jobs && response.data.jobs.length > 0) {
      const job = response.data.jobs[0];
      console.log('\n📋 First Jooble Job:');
      console.log('Title:', job.title);
      console.log('Company:', job.company);
      console.log('URL:', job.link);
      console.log('URL Type:', job.link.includes('jooble') ? '❌ Jooble redirect' : '✅ Direct company URL');
    }
  } catch (error) {
    console.error('❌ Jooble error:', error.message);
  }
}

async function testRemoteOKURLFormat() {
  console.log('\n🔍 Testing RemoteOK URL format...');
  try {
    const response = await axios.get('https://remoteok.com/api', {
      params: { tag: 'dev' }
    });
    
    if (response.data && response.data.length > 1) {
      const job = response.data[1]; // Skip header
      console.log('\n📋 First RemoteOK Job:');
      console.log('Title:', job.position);
      console.log('Company:', job.company);
      console.log('URL:', job.url);
      console.log('Apply URL:', job.apply_url);
      console.log('URL Type:', job.url && job.url.includes('remoteok') ? '❌ RemoteOK redirect' : '✅ Direct company URL');
    }
  } catch (error) {
    console.error('❌ RemoteOK error:', error.message);
  }
}

async function testRemotiveURLFormat() {
  console.log('\n🔍 Testing Remotive URL format...');
  try {
    const response = await axios.get('https://remotive.com/api/remote-jobs', {
      params: { category: 'software-dev' }
    });
    
    if (response.data.jobs && response.data.jobs.length > 0) {
      const job = response.data.jobs[0];
      console.log('\n📋 First Remotive Job:');
      console.log('Title:', job.title);
      console.log('Company:', job.company_name);
      console.log('URL:', job.url);
      console.log('URL Type:', job.url.includes('remotive') ? '❌ Remotive redirect' : '✅ Direct company URL');
    }
  } catch (error) {
    console.error('❌ Remotive error:', error.message);
  }
}

async function testArbeitnowURLFormat() {
  console.log('\n🔍 Testing Arbeitnow URL format...');
  try {
    const response = await axios.get('https://www.arbeitnow.com/api/job-board-api', {
      params: { search: 'developer' }
    });
    
    if (response.data.data && response.data.data.length > 0) {
      const job = response.data.data[0];
      console.log('\n📋 First Arbeitnow Job:');
      console.log('Title:', job.title);
      console.log('Company:', job.company_name);
      console.log('URL:', job.url);
      console.log('URL Type:', job.url.includes('arbeitnow') ? '❌ Arbeitnow redirect' : '✅ Direct company URL');
    }
  } catch (error) {
    console.error('❌ Arbeitnow error:', error.message);
  }
}

async function testAPIJobsURLFormat() {
  console.log('\n🔍 Testing APIJobs.dev URL format...');
  try {
    const response = await axios.get('https://api.apijobs.dev/v1/job/search', {
      params: { 
        q: 'software engineer',
        l: 'remote'
      },
      headers: {
        'apikey': process.env.APIJOBS_API_KEY
      }
    });
    
    if (response.data.hits && response.data.hits.length > 0) {
      const job = response.data.hits[0];
      console.log('\n📋 First APIJobs Job:');
      console.log('Title:', job.title);
      console.log('Company:', job.companyName);
      console.log('URL:', job.url);
      console.log('URL Type:', job.url && job.url.includes('apijobs') ? '❌ APIJobs redirect' : '✅ Direct company URL');
    }
  } catch (error) {
    console.error('❌ APIJobs error:', error.message);
  }
}

async function runTests() {
  console.log('🧪 Testing URL formats from all job APIs...\n');
  console.log('This will show whether APIs provide:');
  console.log('  ✅ Direct company URLs (e.g., careers.google.com)');
  console.log('  ❌ Aggregator redirects (e.g., jooble.org/redirect)');
  console.log('═'.repeat(60));
  
  await testJoobleURLFormat();
  await testRemoteOKURLFormat();
  await testRemotiveURLFormat();
  await testArbeitnowURLFormat();
  await testAPIJobsURLFormat();
  
  console.log('\n' + '═'.repeat(60));
  console.log('\n💡 Analysis:');
  console.log('If you see mostly ❌ redirects, our URL extraction is needed!');
  console.log('If you see ✅ direct URLs, we should use them as-is!\n');
}

runTests();
