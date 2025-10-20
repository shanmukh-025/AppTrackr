require('dotenv').config();
const { Resend } = require('resend');

async function testResendEmail() {
  console.log('🧪 Testing Resend Email Integration...\n');

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: 'AppTrackr <onboarding@resend.dev>',
      to: ['shanmukhasai250@gmail.com'], // MUST match your Resend account email
      subject: '🎉 AppTrackr Email Test - Success!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #667eea;">🎉 Resend Integration Successful!</h1>
          <p>Congratulations! Your AppTrackr email service is now working with Resend.</p>
          
          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0ea5e9; margin-top: 0;">✅ What's Working:</h3>
            <ul style="color: #334155;">
              <li>✅ Resend API integration</li>
              <li>✅ Email delivery to real inboxes</li>
              <li>✅ 3,000 emails/month free tier</li>
              <li>✅ Daily digest scheduled (9:00 AM)</li>
              <li>✅ Deadline reminders (hourly)</li>
              <li>✅ Instant job alerts</li>
            </ul>
          </div>

          <div style="background: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <h3 style="color: #92400e; margin-top: 0;">📧 Email Features Ready:</h3>
            <ul style="color: #78350f;">
              <li>Daily Digest - Application summaries every morning</li>
              <li>Job Match Alerts - Get notified of new opportunities</li>
              <li>Deadline Reminders - Never miss an application deadline</li>
              <li>Status Updates - Track your application progress</li>
            </ul>
          </div>

          <p style="margin-top: 30px; color: #64748b;">
            <strong>Next Steps:</strong><br>
            1. Go to Email Settings in AppTrackr<br>
            2. Enable the notifications you want<br>
            3. Set your preferred digest time<br>
            4. Start tracking applications!
          </p>

          <div style="text-align: center; margin-top: 30px;">
            <a href="http://localhost:3000/email-settings" 
               style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
              Open Email Settings
            </a>
          </div>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;">
          
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            This is a test email from AppTrackr using Resend<br>
            Sent on ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('❌ Test Failed:', error);
      return;
    }

    console.log('✅ Test Email Sent Successfully!');
    console.log('📧 Email ID:', data.id);
    console.log('📬 Sent to: shanmukhasa250@gmail.com');
    console.log('\n💡 Check your inbox (might be in spam initially)');
    console.log('🔗 View in Resend dashboard: https://resend.com/emails');
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testResendEmail();
