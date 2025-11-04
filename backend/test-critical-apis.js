/**
 * Test Script - Critical API Endpoints
 * Verifies all 4 fixed components can make API calls
 * 
 * Note: Run this after backend is started on port 5000
 * Backend must have test user and auth token
 */

const axios = require('axios');

const API_URL = 'http://localhost:5000';
const TEST_TOKEN = 'test-token-placeholder'; // Will use real token from auth

// Color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  reset: '\x1b[0m',
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

async function testEndpoint(method, url, data = null, token = TEST_TOKEN) {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    let response;
    if (method === 'GET') {
      response = await axios.get(url, config);
    } else if (method === 'POST') {
      response = await axios.post(url, data, config);
    }

    return { success: true, status: response.status, data: response.data };
  } catch (error) {
    return {
      success: false,
      status: error.response?.status || 'N/A',
      error: error.response?.data?.error || error.message,
    };
  }
}

async function runTests() {
  log(colors.blue, '\n========== CRITICAL API ENDPOINTS TEST ==========\n');

  // TEST 1: LEARNING PATHS
  log(colors.blue, '1️⃣ LEARNING PATHS TESTS');
  log(colors.yellow, '─────────────────────────────────────');

  const lpTests = [
    {
      name: 'Get Learning Path',
      endpoint: `${API_URL}/api/resources/learning-path?targetRole=Backend%20Developer&experienceLevel=intermediate&skills=JavaScript,Node.js`,
      method: 'GET',
    },
    {
      name: 'Get Learning Milestones',
      endpoint: `${API_URL}/api/resources/learning-path/milestones?targetRole=Backend%20Developer`,
      method: 'GET',
    },
    {
      name: 'Get Resources for Topic',
      endpoint: `${API_URL}/api/resources/learning-path/resources?topic=REST%20APIs&difficulty=Medium`,
      method: 'GET',
    },
  ];

  for (const test of lpTests) {
    log(colors.yellow, `Testing: ${test.name}`);
    const result = await testEndpoint(test.method, test.endpoint);
    if (result.success) {
      log(colors.green, `✅ PASS - Status: ${result.status}`);
    } else {
      log(colors.red, `❌ FAIL - ${result.error}`);
    }
  }

  // TEST 2: CODE EDITOR
  log(colors.blue, '\n2️⃣ CODE EDITOR TESTS');
  log(colors.yellow, '─────────────────────────────────────');

  const ceTests = [
    {
      name: 'Get Code Problems',
      endpoint: `${API_URL}/api/resources/code-editor/problems`,
      method: 'GET',
    },
    {
      name: 'Get Problem by ID',
      endpoint: `${API_URL}/api/resources/code-editor/problem/1`,
      method: 'GET',
    },
    {
      name: 'Execute Code',
      endpoint: `${API_URL}/api/resources/code-editor/execute`,
      method: 'POST',
      data: {
        code: 'console.log("Hello World");',
        language: 'javascript',
        input: '',
      },
    },
  ];

  for (const test of ceTests) {
    log(colors.yellow, `Testing: ${test.name}`);
    const result = await testEndpoint(test.method, test.endpoint, test.data);
    if (result.success) {
      log(colors.green, `✅ PASS - Status: ${result.status}`);
    } else {
      log(colors.red, `❌ FAIL - ${result.error}`);
    }
  }

  // TEST 3: MOCK INTERVIEWS
  log(colors.blue, '\n3️⃣ MOCK INTERVIEW TESTS');
  log(colors.yellow, '─────────────────────────────────────');

  const miTests = [
    {
      name: 'Start Mock Interview',
      endpoint: `${API_URL}/api/resources/mock-interview/start`,
      method: 'POST',
      data: {
        interviewType: 'technical',
        role: 'Backend Developer',
        difficulty: 'Medium',
        duration: 60,
      },
    },
  ];

  for (const test of miTests) {
    log(colors.yellow, `Testing: ${test.name}`);
    const result = await testEndpoint(test.method, test.endpoint, test.data);
    if (result.success) {
      log(colors.green, `✅ PASS - Status: ${result.status}`);
      if (result.data.data?.sessionId) {
        log(colors.green, `   Session ID: ${result.data.data.sessionId}`);
      }
    } else {
      log(colors.red, `❌ FAIL - ${result.error}`);
    }
  }

  // TEST 4: RESUME AI
  log(colors.blue, '\n4️⃣ RESUME AI TESTS');
  log(colors.yellow, '─────────────────────────────────────');

  const raTests = [
    {
      name: 'Generate Resume',
      endpoint: `${API_URL}/api/resources/resume/generate`,
      method: 'POST',
      data: {
        userProfile: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '555-1234',
          summary: 'Software Engineer with 5 years experience',
          experience: [
            { company: 'Tech Corp', role: 'Backend Engineer', years: 3 },
          ],
          skills: ['JavaScript', 'Node.js', 'Python'],
          education: [{ school: 'MIT', degree: 'BS CS' }],
        },
        targetRole: 'Backend Developer',
        targetCompany: 'Google',
      },
    },
  ];

  for (const test of raTests) {
    log(colors.yellow, `Testing: ${test.name}`);
    const result = await testEndpoint(test.method, test.endpoint, test.data);
    if (result.success) {
      log(colors.green, `✅ PASS - Status: ${result.status}`);
    } else {
      log(colors.red, `❌ FAIL - ${result.error}`);
    }
  }

  log(colors.blue, '\n========== TEST SUMMARY ==========\n');
  log(
    colors.green,
    '✅ All API endpoints tested. Check output above for any failures.'
  );
}

// Run tests
runTests().catch((error) => {
  log(colors.red, `❌ Test suite error: ${error.message}`);
  process.exit(1);
});
