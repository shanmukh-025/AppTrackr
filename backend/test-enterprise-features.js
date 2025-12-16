#!/usr/bin/env node

/**
 * API Endpoint Testing Script
 * Tests all 27 enterprise feature endpoints
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:5000';
let authToken = '';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`)
};

// Test authentication first
async function authenticate() {
  log.info('Authenticating test user...');
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email: 'test@example.com',
      password: 'testpassword'
    });
    authToken = response.data.token;
    log.success('Authentication successful');
    return true;
  } catch (error) {
    log.error('Authentication failed. Please ensure you have a test user.');
    return false;
  }
}

// Test Job Clone Detector endpoints
async function testJobCloneDetector() {
  console.log('\n' + '='.repeat(50));
  log.info('Testing Job Clone Detector (6 endpoints)');
  console.log('='.repeat(50));

  const headers = { Authorization: `Bearer ${authToken}` };
  let results = { passed: 0, failed: 0 };

  // 1. GET /scan
  try {
    await axios.get(`${API_URL}/api/job-clone-detector/scan`, { headers });
    log.success('GET /api/job-clone-detector/scan');
    results.passed++;
  } catch (error) {
    log.error(`GET /api/job-clone-detector/scan - ${error.response?.status || error.message}`);
    results.failed++;
  }

  // 2. POST /mark-duplicate
  try {
    await axios.post(`${API_URL}/api/job-clone-detector/mark-duplicate`, 
      { cloneId: 'test-id', action: 'hide' }, 
      { headers }
    );
    log.success('POST /api/job-clone-detector/mark-duplicate');
    results.passed++;
  } catch (error) {
    log.error(`POST /api/job-clone-detector/mark-duplicate - ${error.response?.status || error.message}`);
    results.failed++;
  }

  // 3. POST /blacklist
  try {
    await axios.post(`${API_URL}/api/job-clone-detector/blacklist`, 
      { companyName: 'Test Company', reason: 'Testing' }, 
      { headers }
    );
    log.success('POST /api/job-clone-detector/blacklist');
    results.passed++;
  } catch (error) {
    log.error(`POST /api/job-clone-detector/blacklist - ${error.response?.status || error.message}`);
    results.failed++;
  }

  // 4. GET /blacklist
  try {
    const response = await axios.get(`${API_URL}/api/job-clone-detector/blacklist`, { headers });
    log.success(`GET /api/job-clone-detector/blacklist (${response.data.blacklist?.length || 0} items)`);
    results.passed++;
  } catch (error) {
    log.error(`GET /api/job-clone-detector/blacklist - ${error.response?.status || error.message}`);
    results.failed++;
  }

  // 5. GET /groups
  try {
    await axios.get(`${API_URL}/api/job-clone-detector/groups`, { headers });
    log.success('GET /api/job-clone-detector/groups');
    results.passed++;
  } catch (error) {
    log.error(`GET /api/job-clone-detector/groups - ${error.response?.status || error.message}`);
    results.failed++;
  }

  // 6. DELETE /blacklist/:id (skip for now as we need a valid ID)
  log.warning('DELETE /api/job-clone-detector/blacklist/:id - Skipped (needs valid ID)');

  return results;
}

// Test Smart Notifications endpoints
async function testSmartNotifications() {
  console.log('\n' + '='.repeat(50));
  log.info('Testing Smart Notifications (10 endpoints)');
  console.log('='.repeat(50));

  const headers = { Authorization: `Bearer ${authToken}` };
  let results = { passed: 0, failed: 0 };

  // 1. GET /
  try {
    await axios.get(`${API_URL}/api/smart-notifications`, { headers });
    log.success('GET /api/smart-notifications');
    results.passed++;
  } catch (error) {
    log.error(`GET /api/smart-notifications - ${error.response?.status || error.message}`);
    results.failed++;
  }

  // 2. GET /rules
  try {
    await axios.get(`${API_URL}/api/smart-notifications/rules`, { headers });
    log.success('GET /api/smart-notifications/rules');
    results.passed++;
  } catch (error) {
    log.error(`GET /api/smart-notifications/rules - ${error.response?.status || error.message}`);
    results.failed++;
  }

  // 3. POST /rules
  try {
    await axios.post(`${API_URL}/api/smart-notifications/rules`, {
      name: 'Test Rule',
      description: 'Testing automation',
      conditionType: 'no_response',
      conditionValue: JSON.stringify({ days: 7 }),
      actionType: 'notify',
      actionParams: JSON.stringify({ message: 'Test' }),
      isEnabled: true
    }, { headers });
    log.success('POST /api/smart-notifications/rules');
    results.passed++;
  } catch (error) {
    log.error(`POST /api/smart-notifications/rules - ${error.response?.status || error.message}`);
    results.failed++;
  }

  // 4. GET /ai-insights
  try {
    await axios.get(`${API_URL}/api/smart-notifications/ai-insights`, { headers });
    log.success('GET /api/smart-notifications/ai-insights');
    results.passed++;
  } catch (error) {
    log.error(`GET /api/smart-notifications/ai-insights - ${error.response?.status || error.message}`);
    results.failed++;
  }

  // 5. POST /generate-predictions
  try {
    await axios.post(`${API_URL}/api/smart-notifications/generate-predictions`, {}, { headers });
    log.success('POST /api/smart-notifications/generate-predictions');
    results.passed++;
  } catch (error) {
    log.error(`POST /api/smart-notifications/generate-predictions - ${error.response?.status || error.message}`);
    results.failed++;
  }

  // Skip PATCH and DELETE operations that need valid IDs
  log.warning('PATCH/DELETE endpoints - Skipped (need valid IDs)');

  return results;
}

// Test Network Intelligence endpoints
async function testNetworkIntelligence() {
  console.log('\n' + '='.repeat(50));
  log.info('Testing Network Intelligence (8 endpoints)');
  console.log('='.repeat(50));

  const headers = { Authorization: `Bearer ${authToken}` };
  let results = { passed: 0, failed: 0 };

  // 1. GET /
  try {
    await axios.get(`${API_URL}/api/network-intelligence`, { headers });
    log.success('GET /api/network-intelligence');
    results.passed++;
  } catch (error) {
    log.error(`GET /api/network-intelligence - ${error.response?.status || error.message}`);
    results.failed++;
  }

  // 2. POST /connections
  try {
    await axios.post(`${API_URL}/api/network-intelligence/connections`, {
      connectionName: 'Test Connection',
      connectionEmail: 'test@connection.com',
      company: 'Test Company',
      position: 'Test Position',
      relationshipType: '1st-degree',
      strength: 0.8
    }, { headers });
    log.success('POST /api/network-intelligence/connections');
    results.passed++;
  } catch (error) {
    log.error(`POST /api/network-intelligence/connections - ${error.response?.status || error.message}`);
    results.failed++;
  }

  // 3. POST /discover-paths
  try {
    await axios.post(`${API_URL}/api/network-intelligence/discover-paths`, {
      targetCompany: 'Google',
      targetPosition: 'Software Engineer'
    }, { headers });
    log.success('POST /api/network-intelligence/discover-paths');
    results.passed++;
  } catch (error) {
    log.error(`POST /api/network-intelligence/discover-paths - ${error.response?.status || error.message}`);
    results.failed++;
  }

  // 4. GET /insider-insights
  try {
    await axios.get(`${API_URL}/api/network-intelligence/insider-insights`, { headers });
    log.success('GET /api/network-intelligence/insider-insights');
    results.passed++;
  } catch (error) {
    log.error(`GET /api/network-intelligence/insider-insights - ${error.response?.status || error.message}`);
    results.failed++;
  }

  log.warning('PATCH/DELETE/POST request-intro - Skipped (need valid IDs)');

  return results;
}

// Test Interview Intelligence endpoints
async function testInterviewIntelligence() {
  console.log('\n' + '='.repeat(50));
  log.info('Testing Interview Intelligence (11 endpoints)');
  console.log('='.repeat(50));

  const headers = { Authorization: `Bearer ${authToken}` };
  let results = { passed: 0, failed: 0 };

  // 1. POST /gather
  try {
    await axios.post(`${API_URL}/api/interview-intelligence/gather`, {
      company: 'Google',
      role: 'Software Engineer'
    }, { headers });
    log.success('POST /api/interview-intelligence/gather');
    results.passed++;
  } catch (error) {
    log.error(`POST /api/interview-intelligence/gather - ${error.response?.status || error.message}`);
    results.failed++;
  }

  // 2. GET /intelligence
  try {
    await axios.get(`${API_URL}/api/interview-intelligence/intelligence?company=Google`, { headers });
    log.success('GET /api/interview-intelligence/intelligence');
    results.passed++;
  } catch (error) {
    log.error(`GET /api/interview-intelligence/intelligence - ${error.response?.status || error.message}`);
    results.failed++;
  }

  // 3. POST /questions
  try {
    await axios.post(`${API_URL}/api/interview-intelligence/questions`, {
      question: 'Design a distributed cache',
      type: 'system-design',
      difficulty: 'hard',
      company: 'Google',
      role: 'Software Engineer'
    }, { headers });
    log.success('POST /api/interview-intelligence/questions');
    results.passed++;
  } catch (error) {
    log.error(`POST /api/interview-intelligence/questions - ${error.response?.status || error.message}`);
    results.failed++;
  }

  // 4. GET /questions
  try {
    await axios.get(`${API_URL}/api/interview-intelligence/questions`, { headers });
    log.success('GET /api/interview-intelligence/questions');
    results.passed++;
  } catch (error) {
    log.error(`GET /api/interview-intelligence/questions - ${error.response?.status || error.message}`);
    results.failed++;
  }

  // 5. POST /patterns
  try {
    await axios.post(`${API_URL}/api/interview-intelligence/patterns`, {
      title: 'STAR Method',
      description: 'Structured behavioral answer approach',
      category: 'communication',
      successRate: 85,
      whenToUse: 'Behavioral questions',
      examples: 'Situation, Task, Action, Result'
    }, { headers });
    log.success('POST /api/interview-intelligence/patterns');
    results.passed++;
  } catch (error) {
    log.error(`POST /api/interview-intelligence/patterns - ${error.response?.status || error.message}`);
    results.failed++;
  }

  // 6. GET /patterns
  try {
    await axios.get(`${API_URL}/api/interview-intelligence/patterns`, { headers });
    log.success('GET /api/interview-intelligence/patterns');
    results.passed++;
  } catch (error) {
    log.error(`GET /api/interview-intelligence/patterns - ${error.response?.status || error.message}`);
    results.failed++;
  }

  // 7. POST /mock-interview
  try {
    await axios.post(`${API_URL}/api/interview-intelligence/mock-interview`, {
      company: 'Google',
      role: 'Software Engineer',
      type: 'technical',
      difficulty: 'medium',
      duration: 5
    }, { headers });
    log.success('POST /api/interview-intelligence/mock-interview');
    results.passed++;
  } catch (error) {
    log.error(`POST /api/interview-intelligence/mock-interview - ${error.response?.status || error.message}`);
    results.failed++;
  }

  // 8. GET /statistics
  try {
    await axios.get(`${API_URL}/api/interview-intelligence/statistics`, { headers });
    log.success('GET /api/interview-intelligence/statistics');
    results.passed++;
  } catch (error) {
    log.error(`GET /api/interview-intelligence/statistics - ${error.response?.status || error.message}`);
    results.failed++;
  }

  log.warning('POST upvote endpoints - Skipped (need valid IDs)');

  return results;
}

// Main test runner
async function runTests() {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 Enterprise Features API Test Suite');
  console.log('='.repeat(50));
  console.log(`Testing API: ${API_URL}\n`);

  // Authenticate
  const authenticated = await authenticate();
  if (!authenticated) {
    log.error('Cannot proceed without authentication');
    process.exit(1);
  }

  // Run all tests
  const results = {
    jobCloneDetector: await testJobCloneDetector(),
    smartNotifications: await testSmartNotifications(),
    networkIntelligence: await testNetworkIntelligence(),
    interviewIntelligence: await testInterviewIntelligence()
  };

  // Calculate totals
  const totalPassed = Object.values(results).reduce((sum, r) => sum + r.passed, 0);
  const totalFailed = Object.values(results).reduce((sum, r) => sum + r.failed, 0);
  const totalTests = totalPassed + totalFailed;

  // Print summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Summary');
  console.log('='.repeat(50));
  console.log(`Total Tests: ${totalTests}`);
  log.success(`Passed: ${totalPassed}`);
  if (totalFailed > 0) {
    log.error(`Failed: ${totalFailed}`);
  }
  console.log(`Success Rate: ${((totalPassed / totalTests) * 100).toFixed(1)}%`);
  console.log('='.repeat(50) + '\n');

  // Feature breakdown
  console.log('Feature Breakdown:');
  console.log(`  Job Clone Detector: ${results.jobCloneDetector.passed}/${results.jobCloneDetector.passed + results.jobCloneDetector.failed} passed`);
  console.log(`  Smart Notifications: ${results.smartNotifications.passed}/${results.smartNotifications.passed + results.smartNotifications.failed} passed`);
  console.log(`  Network Intelligence: ${results.networkIntelligence.passed}/${results.networkIntelligence.passed + results.networkIntelligence.failed} passed`);
  console.log(`  Interview Intelligence: ${results.interviewIntelligence.passed}/${results.interviewIntelligence.passed + results.interviewIntelligence.failed} passed`);

  process.exit(totalFailed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  log.error(`Test suite failed: ${error.message}`);
  process.exit(1);
});
