# Email Service Setup Guide

## Overview
AppTrackr uses Nodemailer to send email notifications. You need to configure your email credentials to enable this feature.

## Gmail Setup (Recommended)

### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account: https://myaccount.google.com/
2. Click on "Security" in the left sidebar
3. Enable "2-Step Verification" if not already enabled

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. In the "Select app" dropdown, choose "Mail"
3. In the "Select device" dropdown, choose "Other (Custom name)"
4. Enter "AppTrackr" as the name
5. Click "Generate"
6. **Copy the 16-character app password** (you won't see it again!)

### Step 3: Update .env File
Add these lines to your `backend/.env` file:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
EMAIL_FROM="AppTrackr <your-email@gmail.com>"
```

**Example:**
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=shanmukhasa250@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
EMAIL_FROM="AppTrackr <shanmukhasa250@gmail.com>"
```

### Step 4: Restart Backend Server
```bash
cd backend
node server.js
```

You should see:
```
✅ Email service initialized
📅 Daily digest scheduled for 9:00 AM daily
⏰ Deadline reminders scheduled (hourly)
```

## Other Email Providers

### Outlook/Hotmail
```env
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your-email@outlook.com
EMAIL_PASSWORD=your-password
EMAIL_FROM="AppTrackr <your-email@outlook.com>"
```

### Yahoo Mail
```env
EMAIL_HOST=smtp.mail.yahoo.com
EMAIL_PORT=587
EMAIL_USER=your-email@yahoo.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM="AppTrackr <your-email@yahoo.com>"
```

### Custom SMTP Server
```env
EMAIL_HOST=your-smtp-server.com
EMAIL_PORT=587
EMAIL_USER=your-email@domain.com
EMAIL_PASSWORD=your-password
EMAIL_FROM="AppTrackr <your-email@domain.com>"
```

## Email Features

Once configured, users will receive:

1. **Daily Digest** (9:00 AM)
   - Application summary
   - Upcoming interviews
   - New job matches
   - Deadline reminders

2. **Instant Alerts**
   - New jobs matching your profile
   - Immediately sent when match found

3. **Deadline Reminders**
   - 3 days before application deadline
   - 1 day before application deadline

4. **Status Updates**
   - When application status changes
   - Interview scheduled notifications

## Testing Email Service

After setup, you can test by:

1. Go to Email Settings in the app
2. Enable "Daily Digest"
3. Set digest time to current time + 2 minutes
4. Wait 2 minutes and check your email

OR use the backend test script:

```javascript
// backend/testEmail.js
const emailService = require('./services/emailService');

async function test() {
  emailService.initializeTransporter();
  
  const result = await emailService.sendEmail(
    'your-email@gmail.com',
    'Test Email from AppTrackr',
    '<h1>Hello!</h1><p>Email service is working!</p>'
  );
  
  console.log('Result:', result);
}

test();
```

Run with:
```bash
node testEmail.js
```

## Troubleshooting

### Error: "Invalid login"
- Make sure you're using an **App Password**, not your regular Gmail password
- Check that 2-Factor Authentication is enabled

### Error: "Connection timeout"
- Check your internet connection
- Verify EMAIL_HOST and EMAIL_PORT are correct
- Some networks block port 587 - try port 465 with `secure: true`

### Emails not being sent
- Check backend console for errors
- Verify .env file is in the `backend/` directory
- Make sure to restart the server after updating .env

### Emails going to spam
- Add your email to contacts
- Mark first email as "Not Spam"
- Set up SPF/DKIM records (advanced, for production)

## Production Deployment

For production, consider using:
- **SendGrid** (Free tier: 100 emails/day)
- **Mailgun** (Free tier: 5,000 emails/month)
- **AWS SES** (Pay as you go, very cheap)

These services provide better deliverability and detailed analytics.

## Custom Digest Time (Future Enhancement)

Currently, daily digest runs at 9:00 AM for all users. To support custom times per user, we need to:

1. Update User model to include `digestTime` field
2. Modify cron job to check each user's preferred time
3. Update frontend to allow time selection

This is planned for a future update!
