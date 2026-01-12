const mongoose = require('mongoose');

const treeSubmissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    imageUrl: {
        type: String,
        required: [true, 'Image is required'],
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true,
    },
    plantedDate: {
        type: Date,
        required: true,
    },
    aiAnalysis: {
        classification: {
            type: String,
            enum: ['likely_genuine', 'likely_fake', 'uncertain'],
            required: true,
        },
        confidence: {
            type: Number,
            min: 0,
            max: 1,
            required: true,
        },
        reasoning: {
            type: String,
            required: true,
        },
        modelUsed: {
            type: String,
            required: true,
        },
        analyzedAt: {
            type: Date,
            default: Date.now,
        },
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    adminDecision: {
        type: String,
        trim: true,
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    reviewedAt: {
        type: Date,
    },
    pointsAwarded: {
        type: Number,
        default: 0,
        min: [0, 'Points cannot be negative'],
    },
    month: {
        type: String,
        required: true,
        match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format'],
    },
}, {
    timestamps: true,
});

// Indexes
treeSubmissionSchema.index({ userId: 1, status: 1, month: -1 });
treeSubmissionSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('TreeSubmission', treeSubmissionSchema);
