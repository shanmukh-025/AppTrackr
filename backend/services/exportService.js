const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Convert array of objects to CSV
function convertToCSV(data, headers) {
  if (!data || data.length === 0) {
    return 'No data available';
  }

  // Create header row
  const headerRow = headers.join(',');

  // Create data rows
  const dataRows = data.map((item) => {
    return headers.map((header) => {
      let value = item[header] || '';
      
      // Escape quotes and wrap in quotes if contains comma
      if (typeof value === 'string') {
        value = value.replace(/"/g, '""');
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          value = `"${value}"`;
        }
      }
      
      return value;
    }).join(',');
  });

  return [headerRow, ...dataRows].join('\n');
}

// Export applications to CSV
async function exportApplicationsToCSV(userId) {
  try {
    const applications = await prisma.application.findMany({
      where: { userId },
      orderBy: { dateApplied: 'desc' },
    });

    if (applications.length === 0) {
      return {
        success: true,
        csv: 'No applications found',
        filename: 'applications.csv',
      };
    }

    const headers = [
      'Company',
      'Position',
      'Status',
      'Date Applied',
      'Salary Range',
      'Location',
      'Job Type',
      'Work Mode',
      'Experience Level',
      'Applied Date',
      'Screening Date',
      'Interview Date',
      'Offer Date',
      'Rejected Date',
      'Next Follow-up',
      'Notes',
    ];

    const formattedData = applications.map((app) => ({
      Company: app.company,
      Position: app.position,
      Status: app.status,
      'Date Applied': app.dateApplied ? new Date(app.dateApplied).toLocaleDateString() : '',
      'Salary Range': app.salaryRange || '',
      Location: app.location || '',
      'Job Type': app.jobType || '',
      'Work Mode': app.workMode || '',
      'Experience Level': app.experienceLevel || '',
      'Applied Date': app.appliedDate ? new Date(app.appliedDate).toLocaleDateString() : '',
      'Screening Date': app.screeningDate ? new Date(app.screeningDate).toLocaleDateString() : '',
      'Interview Date': app.interviewDate ? new Date(app.interviewDate).toLocaleDateString() : '',
      'Offer Date': app.offerDate ? new Date(app.offerDate).toLocaleDateString() : '',
      'Rejected Date': app.rejectedDate ? new Date(app.rejectedDate).toLocaleDateString() : '',
      'Next Follow-up': app.nextFollowUp ? new Date(app.nextFollowUp).toLocaleDateString() : '',
      Notes: app.notes || '',
    }));

    const csv = convertToCSV(formattedData, headers);

    return {
      success: true,
      csv,
      filename: `applications-${new Date().toISOString().split('T')[0]}.csv`,
    };
  } catch (error) {
    console.error('Error exporting applications:', error);
    throw error;
  }
}

// Export bookmarked jobs to CSV
async function exportBookmarksToCSV(userId) {
  try {
    const bookmarks = await prisma.jobBookmark.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (bookmarks.length === 0) {
      return {
        success: true,
        csv: 'No bookmarks found',
        filename: 'bookmarks.csv',
      };
    }

    const headers = [
      'Company',
      'Position',
      'Location',
      'Salary Range',
      'Job URL',
      'Bookmarked Date',
    ];

    const formattedData = bookmarks.map((bookmark) => ({
      Company: bookmark.company,
      Position: bookmark.position,
      Location: bookmark.location || '',
      'Salary Range': bookmark.salaryRange || '',
      'Job URL': bookmark.jobUrl,
      'Bookmarked Date': bookmark.createdAt ? new Date(bookmark.createdAt).toLocaleDateString() : '',
    }));

    const csv = convertToCSV(formattedData, headers);

    return {
      success: true,
      csv,
      filename: `bookmarks-${new Date().toISOString().split('T')[0]}.csv`,
    };
  } catch (error) {
    console.error('Error exporting bookmarks:', error);
    throw error;
  }
}

// Export resumes to CSV
async function exportResumesToCSV(userId) {
  try {
    const resumes = await prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (resumes.length === 0) {
      return {
        success: true,
        csv: 'No resumes found',
        filename: 'resumes.csv',
      };
    }

    const headers = [
      'Resume Name',
      'Template',
      'Upload Date',
      'File Name',
      'File Size (KB)',
      'Is Active',
      'Version',
    ];

    const formattedData = resumes.map((resume) => ({
      'Resume Name': resume.name,
      Template: resume.template,
      'Upload Date': resume.createdAt ? new Date(resume.createdAt).toLocaleDateString() : '',
      'File Name': resume.fileName || 'N/A',
      'File Size (KB)': resume.fileSize ? Math.round(resume.fileSize / 1024) : 'N/A',
      'Is Active': resume.isActive ? 'Yes' : 'No',
      Version: resume.version,
    }));

    const csv = convertToCSV(formattedData, headers);

    return {
      success: true,
      csv,
      filename: `resumes-${new Date().toISOString().split('T')[0]}.csv`,
    };
  } catch (error) {
    console.error('Error exporting resumes:', error);
    throw error;
  }
}

// Export notes to CSV
async function exportNotesToCSV(userId) {
  try {
    const notes = await prisma.note.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (notes.length === 0) {
      return {
        success: true,
        csv: 'No notes found',
        filename: 'notes.csv',
      };
    }

    const headers = [
      'Type',
      'Company',
      'Position',
      'Content',
      'Pinned',
      'Created Date',
      'Last Updated',
    ];

    const formattedData = notes.map((note) => ({
      Type: note.type,
      Company: note.targetCompany,
      Position: note.targetPosition,
      Content: note.content,
      Pinned: note.isPinned ? 'Yes' : 'No',
      'Created Date': note.createdAt ? new Date(note.createdAt).toLocaleDateString() : '',
      'Last Updated': note.updatedAt ? new Date(note.updatedAt).toLocaleDateString() : '',
    }));

    const csv = convertToCSV(formattedData, headers);

    return {
      success: true,
      csv,
      filename: `notes-${new Date().toISOString().split('T')[0]}.csv`,
    };
  } catch (error) {
    console.error('Error exporting notes:', error);
    throw error;
  }
}

// Export all user data to CSV (summary)
async function exportAllDataToCSV(userId) {
  try {
    const [applications, bookmarks, resumes, notes] = await Promise.all([
      prisma.application.count({ where: { userId } }),
      prisma.jobBookmark.count({ where: { userId } }),
      prisma.resume.count({ where: { userId } }),
      prisma.note.count({ where: { userId } }),
    ]);

    const summaryData = [
      { Metric: 'Total Applications', Count: applications },
      { Metric: 'Total Bookmarked Jobs', Count: bookmarks },
      { Metric: 'Total Resumes', Count: resumes },
      { Metric: 'Total Notes', Count: notes },
      { Metric: 'Export Date', Count: new Date().toLocaleDateString() },
    ];

    const headers = ['Metric', 'Count'];
    const csv = convertToCSV(summaryData, headers);

    return {
      success: true,
      csv,
      filename: `data-summary-${new Date().toISOString().split('T')[0]}.csv`,
    };
  } catch (error) {
    console.error('Error exporting data summary:', error);
    throw error;
  }
}

module.exports = {
  convertToCSV,
  exportApplicationsToCSV,
  exportBookmarksToCSV,
  exportResumesToCSV,
  exportNotesToCSV,
  exportAllDataToCSV,
};
