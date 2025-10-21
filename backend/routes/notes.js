const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const notesService = require('../services/notesService');

const router = express.Router();

// Create note
router.post('/add', authenticateToken, async (req, res) => {
  try {
    const { type, targetId, targetCompany, targetPosition, content, isPinned } = req.body;

    if (!type || !targetCompany || !targetPosition || !content) {
      return res.status(400).json({
        success: false,
        message: 'type, targetCompany, targetPosition, and content are required',
      });
    }

    const result = await notesService.addNote(req.userId, {
      type,
      targetId,
      targetCompany,
      targetPosition,
      content,
      isPinned,
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating note',
      error: error.message,
    });
  }
});

// Update note
router.put('/update/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { content, isPinned } = req.body;

    if (!content && isPinned === undefined) {
      return res.status(400).json({
        success: false,
        message: 'At least one update field is required',
      });
    }

    const result = await notesService.updateNote(req.userId, id, {
      content,
      isPinned,
    });

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Error updating note:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating note',
      error: error.message,
    });
  }
});

// Delete note
router.delete('/delete/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await notesService.deleteNote(req.userId, id);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting note',
      error: error.message,
    });
  }
});

// Get all notes
router.get('/list', authenticateToken, async (req, res) => {
  try {
    const { type, targetId, sortBy = 'createdAt', order = 'desc', limit = 100, skip = 0 } = req.query;

    const result = await notesService.getUserNotes(req.userId, {
      type,
      targetId,
      sortBy,
      order,
      limit: parseInt(limit),
      skip: parseInt(skip),
    });

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notes',
      error: error.message,
    });
  }
});

// Get pinned notes
router.get('/pinned', authenticateToken, async (req, res) => {
  try {
    const result = await notesService.getPinnedNotes(req.userId);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching pinned notes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pinned notes',
      error: error.message,
    });
  }
});

// Get notes for specific target
router.get('/target/:targetId', authenticateToken, async (req, res) => {
  try {
    const { targetId } = req.params;
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'type query parameter is required',
      });
    }

    const result = await notesService.getNotesForTarget(req.userId, targetId, type);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching notes for target:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notes for target',
      error: error.message,
    });
  }
});

// Get notes by company
router.get('/company/:company', authenticateToken, async (req, res) => {
  try {
    const { company } = req.params;

    const result = await notesService.getNotesByCompany(req.userId, decodeURIComponent(company));
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching notes by company:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching notes by company',
      error: error.message,
    });
  }
});

// Get note count
router.get('/count', authenticateToken, async (req, res) => {
  try {
    const { type } = req.query;

    const result = await notesService.getNoteCount(req.userId, type || null);
    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching note count:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching note count',
      error: error.message,
    });
  }
});

module.exports = router;
