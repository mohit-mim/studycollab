const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const crypto = require('crypto');

// @desc    Get all groups for current user
// @route   GET /api/groups
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const groups = await Group.find({
            $or: [{ admin: req.user.id }, { members: req.user.id }]
        }).populate('admin', 'name email').populate('members', 'name email');

        res.status(200).json({
            success: true,
            count: groups.length,
            data: groups
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
});

// @desc    Create a new group
// @route   POST /api/groups
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { name, description } = req.body;

        // Generate unique 6-char code
        let code;
        let isUnique = false;
        while (!isUnique) {
            code = crypto.randomBytes(3).toString('hex').toUpperCase();
            const existing = await Group.findOne({ code });
            if (!existing) isUnique = true;
        }

        const group = await Group.create({
            name,
            description,
            code,
            admin: req.user.id,
            members: [req.user.id] // Admin is also a member
        });

        res.status(201).json({
            success: true,
            data: group
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
});

// @desc    Join a group
// @route   POST /api/groups/join
// @access  Private
router.post('/join', protect, async (req, res) => {
    try {
        const { code } = req.body;

        const group = await Group.findOne({ code });

        if (!group) {
            return res.status(404).json({ success: false, message: 'Group not found with this code' });
        }

        // Check if already a member
        if (group.members.includes(req.user.id)) {
            return res.status(400).json({ success: false, message: 'You are already a member of this group' });
        }

        group.members.push(req.user.id);
        await group.save();

        res.status(200).json({
            success: true,
            data: group
        });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server Error', error: err.message });
    }
});

module.exports = router;
