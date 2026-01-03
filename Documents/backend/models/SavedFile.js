const mongoose = require('mongoose');

const savedFileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        default: null
    },
    name: {
        type: String,
        required: [true, 'Please provide a file name'],
        trim: true
    },
    language: {
        type: String,
        enum: ['javascript', 'python', 'cpp', 'html', 'css', 'java'],
        required: true
    },
    content: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    },
    tags: [{
        type: String,
        trim: true
    }],
    isPublic: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for faster queries
savedFileSchema.index({ userId: 1, createdAt: -1 });
savedFileSchema.index({ projectId: 1 });

module.exports = mongoose.model('SavedFile', savedFileSchema);
