const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    recipientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    recipientRole: {
        type: String,
        enum: ['admin', 'owner', 'tenant', 'visitor', 'employee', 'all'],
        enum: ['admin', 'owner', 'tenant', 'employee', 'all'],
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    message: {
        type: String,
        required: [true, 'Message is required'],
        trim: true,
    },
    type: {
        type: String,
        enum: ['info', 'warning', 'success', 'error'],
        default: 'info',
    },
    category: {
        type: String,
        enum: ['bill', 'payment', 'booking', 'problem', 'tree', 'leave', 'general'],
        default: 'general',
    },
    relatedId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    relatedModel: {
        type: String,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    sentViaEmail: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

// Indexes
notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ recipientRole: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
