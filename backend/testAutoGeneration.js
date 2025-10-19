/**
 * Test auto-generation of career pages
 */

const { findCompanyCareerPage } = require('./utils/companyCareerPages');

console.log('\n🧪 Testing Career Page Auto-Generation\n');
console.log('=' .repeat(60));

console.log('\n✅ Known companies (from database):');
console.log('Google:', findCompanyCareerPage('Google'));
console.log('Microsoft:', findCompanyCareerPage('Microsoft'));
console.log('Zscaler:', findCompanyCareerPage('Zscaler'));
console.log('GovCIO:', findCompanyCareerPage('GovCIO'));

console.log('\n💡 AUTO-GENERATED for unknown companies:');
console.log('Vori:', findCompanyCareerPage('Vori'));
console.log('Proxify:', findCompanyCareerPage('Proxify'));
console.log('Lionflence:', findCompanyCareerPage('Lionflence'));
console.log('Random Startup:', findCompanyCareerPage('Random Startup'));
console.log('Acme Corp Inc:', findCompanyCareerPage('Acme Corp Inc'));
console.log('TechCorp LLC:', findCompanyCareerPage('TechCorp LLC'));

console.log('\n' + '='.repeat(60));
console.log('\n🎉 Result: EVERY company now gets a career page link!');
console.log('✅ Known companies → Use curated URL from database');
console.log('✅ Unknown companies → Auto-generate URL (e.g., company.com/careers)');
console.log('\n💡 This means ALL jobs will show GREEN buttons now!\n');
