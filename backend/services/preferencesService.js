const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Get user preferences
async function getUserPreferences(userId) {
  try {
    let preferences = await prisma.userPreference.findUnique({
      where: { userId },
    });

    if (!preferences) {
      // Create default preferences if they don't exist
      preferences = await prisma.userPreference.create({
        data: {
          userId,
          theme: 'light',
          language: 'en',
        },
      });
    }

    return {
      success: true,
      preferences,
    };
  } catch (error) {
    console.error('Error getting user preferences:', error);
    throw error;
  }
}

// Update user preferences
async function updateUserPreferences(userId, updates) {
  try {
    let preferences = await prisma.userPreference.findUnique({
      where: { userId },
    });

    if (!preferences) {
      // Create if doesn't exist
      preferences = await prisma.userPreference.create({
        data: {
          userId,
          ...updates,
        },
      });
    } else {
      // Update existing
      preferences = await prisma.userPreference.update({
        where: { userId },
        data: updates,
      });
    }

    return {
      success: true,
      message: 'Preferences updated successfully',
      preferences,
    };
  } catch (error) {
    console.error('Error updating preferences:', error);
    throw error;
  }
}

// Update theme
async function updateTheme(userId, theme) {
  try {
    if (!['light', 'dark', 'auto'].includes(theme)) {
      return {
        success: false,
        message: 'Invalid theme. Must be "light", "dark", or "auto"',
      };
    }

    const result = await updateUserPreferences(userId, { theme });
    return result;
  } catch (error) {
    console.error('Error updating theme:', error);
    throw error;
  }
}

// Get theme
async function getTheme(userId) {
  try {
    const result = await getUserPreferences(userId);
    return {
      success: true,
      theme: result.preferences.theme,
    };
  } catch (error) {
    console.error('Error getting theme:', error);
    throw error;
  }
}

module.exports = {
  getUserPreferences,
  updateUserPreferences,
  updateTheme,
  getTheme,
};
