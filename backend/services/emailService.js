const { Resend } = require('resend');
const prisma = require('../prisma/client');
const cron = require('node-cron');

class EmailService {
  constructor() {
    // Create Resend client
    this.resend = null;
    this.isConfigured = false;
  }

  /**
   * Initialize Resend client
   */
  initializeTransporter() {
    if (this.isConfigured) return;

    try {
      // Check if Resend API key is configured
      if (!process.env.RESEND_API_KEY) {
        console.log('⚠️  Email service not configured. Set RESEND_API_KEY in .env');
        return;
      }

      this.resend = new Resend(process.env.RESEND_API_KEY);
      this.isConfigured = true;
      console.log('✅ Email service initialized (Resend)');
    } catch (error) {
      console.error('❌ Email service initialization failed:', error.message);
    }
  }

  /**
   * Send a single email
   */
  async sendEmail(to, subject, html) {
    if (!this.isConfigured) {
      console.log('⚠️  Email not sent (service not configured):', subject);
      return { success: false, message: 'Email service not configured' };
    }

    try {
      const { data, error } = await this.resend.emails.send({
        from: process.env.EMAIL_FROM || 'AppTrackr <onboarding@resend.dev>',
        to: [to],
        subject,
        html,
      });

      if (error) {
        console.error('❌ Email send error:', error);
        return { success: false, error: error.message };
      }

      console.log('✉️  Email sent:', data.id);
      return { success: true, messageId: data.id };
    } catch (error) {
      console.error('❌ Email send error:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send job match alert
   */
  async sendJobMatchAlert(user, jobs) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #667eea;">🎯 New Job Matches for You!</h2>
        <p>Hi ${user.name || 'there'},</p>
        <p>We found ${jobs.length} new job${jobs.length > 1 ? 's' : ''} that match your profile:</p>
        
        ${jobs.map(job => `
          <div style="background: #f7f7f7; padding: 15px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #667eea;">
            <h3 style="margin: 0 0 10px 0; color: #333;">${job.title}</h3>
            <p style="margin: 5px 0; color: #666;">
              <strong>Company:</strong> ${job.company}<br>
              <strong>Location:</strong> ${job.location || 'Remote'}<br>
              ${job.salary ? `<strong>Salary:</strong> ${job.salary}<br>` : ''}
            </p>
            <a href="${job.url}" style="display: inline-block; margin-top: 10px; padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px;">View Job</a>
          </div>
        `).join('')}
        
        <p style="margin-top: 20px; color: #666;">
          <small>You're receiving this because you enabled job alerts in AppTrackr.</small>
        </p>
      </div>
    `;

    return await this.sendEmail(
      user.email,
      `🎯 ${jobs.length} New Job Match${jobs.length > 1 ? 'es' : ''} for You!`,
      html
    );
  }

  /**
   * Send daily digest
   */
  async sendDailyDigest(user, stats) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #667eea;">📊 Your Daily Job Search Digest</h2>
        <p>Hi ${user.name || 'there'},</p>
        <p>Here's your daily summary:</p>
        
        <div style="background: #f7f7f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <div style="margin: 15px 0;">
            <h3 style="color: #667eea; margin: 0;">📋 ${stats.totalApplications || 0}</h3>
            <p style="margin: 5px 0; color: #666;">Total Applications</p>
          </div>
          
          <div style="margin: 15px 0;">
            <h3 style="color: #4caf50; margin: 0;">✅ ${stats.activeApplications || 0}</h3>
            <p style="margin: 5px 0; color: #666;">Active Applications</p>
          </div>
          
          <div style="margin: 15px 0;">
            <h3 style="color: #ff9800; margin: 0;">⏰ ${stats.upcomingInterviews || 0}</h3>
            <p style="margin: 5px 0; color: #666;">Upcoming Interviews</p>
          </div>
          
          ${stats.newMatches > 0 ? `
            <div style="margin: 15px 0;">
              <h3 style="color: #2196f3; margin: 0;">🆕 ${stats.newMatches}</h3>
              <p style="margin: 5px 0; color: #666;">New Job Matches</p>
            </div>
          ` : ''}
        </div>
        
        ${stats.reminders && stats.reminders.length > 0 ? `
          <h3>⏰ Reminders</h3>
          <ul style="list-style: none; padding: 0;">
            ${stats.reminders.map(r => `
              <li style="background: #fff3e0; padding: 10px; margin: 5px 0; border-radius: 5px; border-left: 3px solid #ff9800;">
                ${r}
              </li>
            `).join('')}
          </ul>
        ` : ''}
        
        <p style="margin-top: 20px;">
          <a href="http://localhost:3000/dashboard" style="display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px;">Open AppTrackr</a>
        </p>
        
        <p style="margin-top: 20px; color: #666; font-size: 12px;">
          You're receiving this daily digest. Manage your email preferences in Settings.
        </p>
      </div>
    `;

    return await this.sendEmail(
      user.email,
      '📊 Your Daily Job Search Digest',
      html
    );
  }

  /**
   * Send application deadline reminder
   */
  async sendDeadlineReminder(user, application, daysLeft) {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #ff9800;">⏰ Application Deadline Reminder</h2>
        <p>Hi ${user.name || 'there'},</p>
        <p style="font-size: 16px;">
          <strong>Reminder:</strong> Your application deadline is approaching!
        </p>
        
        <div style="background: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ff9800;">
          <h3 style="margin: 0 0 10px 0; color: #333;">${application.position}</h3>
          <p style="margin: 5px 0; color: #666;">
            <strong>Company:</strong> ${application.company}<br>
            <strong>Deadline:</strong> ${new Date(application.deadline).toLocaleDateString()}<br>
            <strong>Days Left:</strong> ${daysLeft} day${daysLeft !== 1 ? 's' : ''}
          </p>
        </div>
        
        <p>
          <a href="http://localhost:3000/applications" style="display: inline-block; padding: 12px 24px; background: #ff9800; color: white; text-decoration: none; border-radius: 5px;">View Application</a>
        </p>
      </div>
    `;

    return await this.sendEmail(
      user.email,
      `⏰ Deadline Reminder: ${application.position} at ${application.company}`,
      html
    );
  }

  /**
   * Send status change notification
   */
  async sendStatusChangeNotification(user, application, oldStatus, newStatus) {
    const statusEmojis = {
      applied: '📝',
      screening: '👀',
      interview: '💼',
      offer: '🎉',
      accepted: '✅',
      rejected: '❌'
    };

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #667eea;">📬 Application Status Updated</h2>
        <p>Hi ${user.name || 'there'},</p>
        <p>Your application status has been updated:</p>
        
        <div style="background: #f7f7f7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin: 0 0 10px 0; color: #333;">${application.position}</h3>
          <p style="margin: 5px 0; color: #666;">
            <strong>Company:</strong> ${application.company}
          </p>
          <div style="margin-top: 15px; padding: 15px; background: white; border-radius: 5px;">
            <p style="margin: 5px 0;">
              <strong>Old Status:</strong> ${statusEmojis[oldStatus] || '📝'} ${oldStatus}
            </p>
            <p style="margin: 5px 0;">
              <strong>New Status:</strong> ${statusEmojis[newStatus] || '📝'} ${newStatus}
            </p>
          </div>
        </div>
        
        <p>
          <a href="http://localhost:3000/applications" style="display: inline-block; padding: 12px 24px; background: #667eea; color: white; text-decoration: none; border-radius: 5px;">View Details</a>
        </p>
      </div>
    `;

    return await this.sendEmail(
      user.email,
      `📬 Status Update: ${application.position} at ${application.company}`,
      html
    );
  }

  /**
   * Schedule daily digest cron job (runs at 9 AM every day)
   */
  scheduleDailyDigest() {
    if (!this.isConfigured) {
      console.log('⚠️  Daily digest scheduling skipped (email not configured)');
      return;
    }

    // Run at 9:00 AM every day
    cron.schedule('0 9 * * *', async () => {
      console.log('📅 Running daily digest job...');
      
      try {
        // Get all users with daily digest enabled
        const users = await prisma.user.findMany({
          where: { dailyDigest: true },
          include: {
            applications: {
              where: {
                status: { in: ['applied', 'screening', 'interview'] }
              }
            }
          }
        });

        for (const user of users) {
          const stats = {
            totalApplications: user.applications.length,
            activeApplications: user.applications.filter(a => 
              ['applied', 'screening', 'interview'].includes(a.status)
            ).length,
            upcomingInterviews: user.applications.filter(a => 
              a.interviewDate && new Date(a.interviewDate) > new Date()
            ).length,
            newMatches: 0, // Would come from job matching service
            reminders: []
          };

          // Check for upcoming deadlines
          user.applications.forEach(app => {
            if (app.deadline) {
              const daysLeft = Math.ceil((new Date(app.deadline) - new Date()) / (1000 * 60 * 60 * 24));
              if (daysLeft > 0 && daysLeft <= 3) {
                stats.reminders.push(`${app.position} at ${app.company} - Deadline in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}`);
              }
            }
          });

          await this.sendDailyDigest(user, stats);
        }

        console.log(`✅ Daily digest sent to ${users.length} users`);
      } catch (error) {
        console.error('❌ Daily digest error:', error);
      }
    });

    console.log('📅 Daily digest scheduled for 9:00 AM daily');
  }

  /**
   * Check for upcoming deadlines (runs every hour)
   */
  scheduleDeadlineReminders() {
    if (!this.isConfigured) {
      console.log('⚠️  Deadline reminders skipped (email not configured)');
      return;
    }

    // Run every hour
    cron.schedule('0 * * * *', async () => {
      console.log('⏰ Checking for upcoming deadlines...');
      
      try {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(23, 59, 59, 999);

        const threeDays = new Date();
        threeDays.setDate(threeDays.getDate() + 3);
        threeDays.setHours(23, 59, 59, 999);

        // Find applications with deadlines in the next 3 days
        const applications = await prisma.application.findMany({
          where: {
            deadline: {
              gte: new Date(),
              lte: threeDays
            },
            status: { in: ['applied', 'screening'] }
          },
          include: {
            user: {
              where: { applicationReminders: true }
            }
          }
        });

        for (const app of applications) {
          if (!app.user) continue;

          const daysLeft = Math.ceil((new Date(app.deadline) - new Date()) / (1000 * 60 * 60 * 24));
          await this.sendDeadlineReminder(app.user, app, daysLeft);
        }

        console.log(`✅ Checked ${applications.length} upcoming deadlines`);
      } catch (error) {
        console.error('❌ Deadline reminder error:', error);
      }
    });

    console.log('⏰ Deadline reminders scheduled (hourly)');
  }
}

module.exports = new EmailService();
