const mongoose = require('mongoose');

const leaveRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    flatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat',
        required: true,
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required'],
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required'],
    },
    reason: {
        type: String,
        required: [true, 'Reason is required'],
        trim: true,
    },
    emergencyContact: {
        type: String,
        required: [true, 'Emergency contact is required'],
        trim: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    reviewedAt: {
        type: Date,
    },
    adminNotes: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

// Indexes
leaveRequestSchema.index({ userId: 1, status: 1 });
leaveRequestSchema.index({ status: 1, createdAt: -1 });

// Validation: end date must be after start date
leaveRequestSchema.pre('save', function (next) {
    if (this.endDate <= this.startDate) {
        return next(new Error('End date must be after start date'));
    }

    // Enforce next-month leaving window
    const now = new Date();
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const followingMonthStart = new Date(now.getFullYear(), now.getMonth() + 2, 1);

    if (this.startDate < nextMonthStart || this.startDate >= followingMonthStart) {
        return next(new Error('Start date must be within the next calendar month'));
    }
    next();
});

module.exports = mongoose.model('LeaveRequest', leaveRequestSchema);
