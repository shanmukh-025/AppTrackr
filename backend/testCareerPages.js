/**
 * Test Career Pages Database
 * Check if company matching is working
 */

const { findCompanyCareerPage } = require('./utils/companyCareerPages');

console.log('\n🧪 Testing Career Pages Database\n');
console.log('=' .repeat(60));

// Test exact matches
console.log('\n✅ Testing EXACT matches:');
console.log('Google:', findCompanyCareerPage('Google'));
console.log('Microsoft:', findCompanyCareerPage('Microsoft'));
console.log('Apple:', findCompanyCareerPage('Apple'));
console.log('Amazon:', findCompanyCareerPage('Amazon'));
console.log('Meta:', findCompanyCareerPage('Meta'));

// Test partial matches (with Inc, LLC, etc.)
console.log('\n✅ Testing PARTIAL matches (with suffixes):');
console.log('Google Inc:', findCompanyCareerPage('Google Inc'));
console.log('Microsoft Corporation:', findCompanyCareerPage('Microsoft Corporation'));
console.log('Apple Inc.:', findCompanyCareerPage('Apple Inc.'));

// Test case insensitivity
console.log('\n✅ Testing CASE insensitivity:');
console.log('google:', findCompanyCareerPage('google'));
console.log('MICROSOFT:', findCompanyCareerPage('MICROSOFT'));
console.log('aPpLe:', findCompanyCareerPage('aPpLe'));

// Test unknown companies
console.log('\n❌ Testing UNKNOWN companies (should return null):');
console.log('Unknown Startup:', findCompanyCareerPage('Unknown Startup'));
console.log('Vori:', findCompanyCareerPage('Vori'));
console.log('Proxify:', findCompanyCareerPage('Proxify'));
console.log('Lionflence:', findCompanyCareerPage('Lionflence'));

console.log('\n' + '='.repeat(60));
console.log('\n💡 Summary:');
console.log('- Known companies should return career page URLs');
console.log('- Unknown companies should return null (NOT Google search!)');
console.log('- null means frontend will show "View Job Details" button\n');
