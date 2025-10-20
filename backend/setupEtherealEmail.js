const nodemailer = require('nodemailer');

async function setupEthereal() {
  console.log('Creating Ethereal test account...');
  
  // Create a test account
  const testAccount = await nodemailer.createTestAccount();
  
  console.log('\n✅ Ethereal Email Account Created!');
  console.log('\n📧 Add these to your backend/.env file:\n');
  console.log(`EMAIL_HOST=${testAccount.smtp.host}`);
  console.log(`EMAIL_PORT=${testAccount.smtp.port}`);
  console.log(`EMAIL_USER=${testAccount.user}`);
  console.log(`EMAIL_PASSWORD=${testAccount.pass}`);
  console.log(`EMAIL_FROM="AppTrackr <${testAccount.user}>"`);
  
  console.log('\n📬 View sent emails at: https://ethereal.email/messages');
  console.log(`   Login: ${testAccount.user}`);
  console.log(`   Password: ${testAccount.pass}`);
  
  console.log('\n💡 Emails won\'t actually be sent, but you can view them in the web interface!');
}

setupEthereal().catch(console.error);
