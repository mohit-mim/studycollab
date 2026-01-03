const express = require('express');
const router = express.Router();
const File = require('../models/File');
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

// All routes are protected

// @route   GET /api/projects/:projectId/files
// @desc    Get all files in a project
// @access  Private
router.get('/projects/:projectId/files', protect, async (req, res) => {
    try {
        // Check if project exists and user owns it
        const project = await Project.findById(req.params.projectId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        if (project.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        const files = await File.find({ projectId: req.params.projectId });

        res.json({
            success: true,
            count: files.length,
            data: files
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   GET /api/files/:id
// @desc    Get single file
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        const file = await File.findById(req.params.id).populate('projectId');

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        // Check ownership through project
        if (file.projectId.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        res.json({
            success: true,
            data: file
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   POST /api/projects/:projectId/files
// @desc    Create new file in project
// @access  Private
router.post('/projects/:projectId/files', protect, async (req, res) => {
    try {
        const { name, language, content } = req.body;

        // Check if project exists and user owns it
        const project = await Project.findById(req.params.projectId);

        if (!project) {
            return res.status(404).json({
                success: false,
                message: 'Project not found'
            });
        }

        if (project.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        // Create file
        const file = await File.create({
            projectId: req.params.projectId,
            name,
            language: language || project.language,
            content: content || ''
        });

        // Add file to project's files array
        project.files.push(file._id);
        await project.save();

        res.status(201).json({
            success: true,
            data: file
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   PUT /api/files/:id
// @desc    Update file content
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        let file = await File.findById(req.params.id).populate('projectId');

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        // Check ownership
        if (file.projectId.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        file = await File.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            data: file
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

// @route   DELETE /api/files/:id
// @desc    Delete file
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const file = await File.findById(req.params.id).populate('projectId');

        if (!file) {
            return res.status(404).json({
                success: false,
                message: 'File not found'
            });
        }

        // Check ownership
        if (file.projectId.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized'
            });
        }

        // Remove file from project's files array
        await Project.findByIdAndUpdate(
            file.projectId._id,
            { $pull: { files: file._id } }
        );

        // Delete file
        await file.deleteOne();

        res.json({
            success: true,
            message: 'File deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
