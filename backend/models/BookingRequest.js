const mongoose = require('mongoose');

const bookingRequestSchema = new mongoose.Schema({
    visitorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    flatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat',
        required: true,
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
    },
    requestedDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    adminResponse: {
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
}, {
    timestamps: true,
});

// Indexes
bookingRequestSchema.index({ status: 1, createdAt: -1 });
bookingRequestSchema.index({ visitorId: 1 });

module.exports = mongoose.model('BookingRequest', bookingRequestSchema);
