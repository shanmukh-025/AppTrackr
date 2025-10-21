const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Add note
async function addNote(userId, noteData) {
  try {
    const note = await prisma.note.create({
      data: {
        userId,
        type: noteData.type, // "application" or "job"
        targetId: noteData.targetId || null,
        targetCompany: noteData.targetCompany,
        targetPosition: noteData.targetPosition,
        content: noteData.content,
        isPinned: noteData.isPinned || false,
      },
    });

    return {
      success: true,
      message: 'Note created successfully',
      note,
    };
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
}

// Update note
async function updateNote(userId, noteId, updates) {
  try {
    // Verify ownership
    const existingNote = await prisma.note.findFirst({
      where: {
        id: noteId,
        userId,
      },
    });

    if (!existingNote) {
      return {
        success: false,
        message: 'Note not found',
      };
    }

    const note = await prisma.note.update({
      where: { id: noteId },
      data: {
        content: updates.content || existingNote.content,
        isPinned: updates.isPinned !== undefined ? updates.isPinned : existingNote.isPinned,
      },
    });

    return {
      success: true,
      message: 'Note updated successfully',
      note,
    };
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
}

// Delete note
async function deleteNote(userId, noteId) {
  try {
    const existingNote = await prisma.note.findFirst({
      where: {
        id: noteId,
        userId,
      },
    });

    if (!existingNote) {
      return {
        success: false,
        message: 'Note not found',
      };
    }

    await prisma.note.delete({
      where: { id: noteId },
    });

    return {
      success: true,
      message: 'Note deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
}

// Get all notes for user
async function getUserNotes(userId, options = {}) {
  try {
    const { type, targetId, sortBy = 'createdAt', order = 'desc', limit = 100, skip = 0 } = options;

    const where = { userId };
    if (type) where.type = type;
    if (targetId) where.targetId = targetId;

    const notes = await prisma.note.findMany({
      where,
      orderBy: { [sortBy]: order },
      take: limit,
      skip,
    });

    const total = await prisma.note.count({ where });

    return {
      success: true,
      notes,
      pagination: {
        total,
        limit,
        skip,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Error getting notes:', error);
    throw error;
  }
}

// Get pinned notes
async function getPinnedNotes(userId) {
  try {
    const notes = await prisma.note.findMany({
      where: {
        userId,
        isPinned: true,
      },
      orderBy: { updatedAt: 'desc' },
    });

    return {
      success: true,
      notes,
    };
  } catch (error) {
    console.error('Error getting pinned notes:', error);
    throw error;
  }
}

// Get notes for specific target (application/job)
async function getNotesForTarget(userId, targetId, type) {
  try {
    const notes = await prisma.note.findMany({
      where: {
        userId,
        targetId,
        type,
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      notes,
    };
  } catch (error) {
    console.error('Error getting notes for target:', error);
    throw error;
  }
}

// Get notes by company
async function getNotesByCompany(userId, company) {
  try {
    const notes = await prisma.note.findMany({
      where: {
        userId,
        targetCompany: company,
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      notes,
    };
  } catch (error) {
    console.error('Error getting notes by company:', error);
    throw error;
  }
}

// Get note count
async function getNoteCount(userId, type = null) {
  try {
    const where = { userId };
    if (type) where.type = type;

    const count = await prisma.note.count({ where });

    return {
      success: true,
      count,
    };
  } catch (error) {
    console.error('Error getting note count:', error);
    throw error;
  }
}

module.exports = {
  addNote,
  updateNote,
  deleteNote,
  getUserNotes,
  getPinnedNotes,
  getNotesForTarget,
  getNotesByCompany,
  getNoteCount,
};
