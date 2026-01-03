const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please provide a file name'],
        trim: true
    },
    language: {
        type: String,
        enum: ['javascript', 'python', 'cpp', 'html', 'css'],
        required: true
    },
    content: {
        type: String,
        default: ''
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

module.exports = mongoose.model('File', fileSchema);
