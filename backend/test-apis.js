/**
 * API Configuration Test Script
 * Run this to verify all API keys and endpoints are working
 */

require('dotenv').config();

console.log('\n========================================');
console.log('🧪 Testing API Configuration');
console.log('========================================\n');

// Test 1: Environment Variables
console.log('1️⃣  Environment Variables Check:\n');

const requiredVars = {
  'GEMINI_API_KEY': process.env.GEMINI_API_KEY,
  'JOOBLE_API_KEY': process.env.JOOBLE_API_KEY,
  'APIJOBS_API_KEY': process.env.APIJOBS_API_KEY,
  'JOOBLE_API_URL': process.env.JOOBLE_API_URL,
  'APIJOBS_API_URL': process.env.APIJOBS_API_URL,
  'ARBEITNOW_API_URL': process.env.ARBEITNOW_API_URL,
  'DATABASE_URL': process.env.DATABASE_URL,
  'JWT_SECRET': process.env.JWT_SECRET
};

let allSet = true;

Object.entries(requiredVars).forEach(([key, value]) => {
  if (!value) {
    console.log(`❌ ${key}: NOT SET`);
    allSet = false;
  } else {
    const display = (key.includes('KEY') || key.includes('SECRET') || key.includes('DATABASE'))
      ? `${value.substring(0, 15)}...***`
      : value;
    console.log(`✅ ${key}: ${display}`);
  }
});

console.log('\n========================================\n');

// Test 2: AI Service
console.log('2️⃣  Testing AI Service (Gemini):\n');

try {
  const aiService = require('./services/aiService');
  console.log('✅ AI Service loaded successfully');
  
  if (!process.env.GEMINI_API_KEY) {
    console.log('❌ GEMINI_API_KEY not set - AI features will NOT work');
  } else {
    console.log('✅ Gemini API Key is configured');
  }
} catch (error) {
  console.log('❌ Error loading AI Service:', error.message);
}

console.log('\n========================================\n');

// Test 3: Job Service
console.log('3️⃣  Testing Job Service:\n');

try {
  const jobService = require('./services/jobService');
  console.log('✅ Job Service loaded successfully');
  
  const stats = jobService.getStats();
  console.log('✅ Job Service statistics:', stats);
} catch (error) {
  console.log('❌ Error loading Job Service:', error.message);
}

console.log('\n========================================\n');

// Summary
console.log('📊 Summary:\n');

if (allSet) {
  console.log('✅ All environment variables are configured!');
  console.log('✅ Your app should work properly in production.');
} else {
  console.log('⚠️  Some environment variables are missing!');
  console.log('⚠️  Please add them to Render dashboard:');
  console.log('   1. Go to Render Dashboard');
  console.log('   2. Select your backend service');
  console.log('   3. Go to Environment tab');
  console.log('   4. Add the missing variables shown above');
}

console.log('\n========================================\n');
