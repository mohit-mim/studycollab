const express = require('express');
const router = express.Router();
const SavedFile = require('../models/SavedFile');
const { protect } = require('../middleware/auth');

// @route   GET /api/saved-files
// @desc    Get all saved files for the logged-in user
// @access  Private
router.get('/', protect, async (req, res, next) => {
    try {
        const files = await SavedFile.find({ userId: req.user.id })
            .sort({ updatedAt: -1 })
            .select('-__v');

        res.json({
            success: true,
            count: files.length,
            data: files
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/saved-files/:id
// @desc    Get a single saved file by ID
// @access  Private
router.get('/:id', protect, async (req, res, next) => {
    try {
        const file = await SavedFile.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        res.json({
            success: true,
            data: file
        });
    } catch (error) {
        next(error);
    }
});

// @route   POST /api/saved-files
// @desc    Create a new saved file
// @access  Private
router.post('/', protect, async (req, res, next) => {
    try {
        const { name, language, content, description, tags, projectId, isPublic } = req.body;

        const file = await SavedFile.create({
            userId: req.user.id,
            name,
            language,
            content,
            description,
            tags,
            projectId,
            isPublic
        });

        res.status(201).json({
            success: true,
            data: file
        });
    } catch (error) {
        next(error);
    }
});

// @route   PUT /api/saved-files/:id
// @desc    Update a saved file
// @access  Private
router.put('/:id', protect, async (req, res, next) => {
    try {
        const { name, language, content, description, tags, isPublic } = req.body;

        let file = await SavedFile.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        // Update fields
        if (name !== undefined) file.name = name;
        if (language !== undefined) file.language = language;
        if (content !== undefined) file.content = content;
        if (description !== undefined) file.description = description;
        if (tags !== undefined) file.tags = tags;
        if (isPublic !== undefined) file.isPublic = isPublic;

        await file.save();

        res.json({
            success: true,
            data: file
        });
    } catch (error) {
        next(error);
    }
});

// @route   DELETE /api/saved-files/:id
// @desc    Delete a saved file
// @access  Private
router.delete('/:id', protect, async (req, res, next) => {
    try {
        const file = await SavedFile.findOne({
            _id: req.params.id,
            userId: req.user.id
        });

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        await file.deleteOne();

        res.json({
            success: true,
            message: 'File deleted successfully'
        });
    } catch (error) {
        next(error);
    }
});

// @route   GET /api/saved-files/project/:projectId
// @desc    Get all saved files for a specific project
// @access  Private
router.get('/project/:projectId', protect, async (req, res, next) => {
    try {
        const files = await SavedFile.find({
            userId: req.user.id,
            projectId: req.params.projectId
        }).sort({ updatedAt: -1 });

        res.json({
            success: true,
            count: files.length,
            data: files
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
