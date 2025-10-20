/**
 * Test Cover Letter Generation
 * Run: node testCoverLetter.js
 */

const axios = require('axios');
const jwt = require('jsonwebtoken');

// Mock user ID (you'll need to replace this)
const mockUserId = 'test-user-123';

// Generate a test token
const token = jwt.sign(
  { userId: mockUserId },
  process.env.JWT_SECRET || 'test-secret-key'
);

async function testCoverLetterGeneration() {
  try {
    console.log('\n🧪 Testing Cover Letter Generation...\n');
    console.log('Token:', token);
    console.log('User ID in token:', mockUserId);

    const response = await axios.post(
      'http://localhost:5000/api/ai/generate-cover-letter',
      {
        company: 'Google',
        position: 'Software Engineer',
        jobDescription: 'Looking for experienced software engineer with React and Node.js skills',
        tone: 'professional'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('\n✅ SUCCESS!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('\n❌ ERROR:');
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
    console.error('Message:', error.message);
  }
}

testCoverLetterGeneration();
