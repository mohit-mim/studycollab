const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide an assignment title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a description']
    },
    dueDate: {
        type: Date,
        required: [true, 'Please provide a due date']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    language: {
        type: String,
        enum: ['javascript', 'python', 'cpp', 'html'],
        default: 'javascript'
    },
    starterCode: {
        type: String,
        default: ''
    },
    submissions: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        code: {
            type: String,
            required: true
        },
        submittedAt: {
            type: Date,
            default: Date.now
        },
        grade: {
            type: Number,
            min: 0,
            max: 100
        },
        feedback: String
    }],
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

module.exports = mongoose.model('Assignment', assignmentSchema);
