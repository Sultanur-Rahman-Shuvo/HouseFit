const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    billId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bill',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount cannot be negative'],
    },
    bkashTransactionId: {
        type: String,
        required: [true, 'bKash transaction ID is required'],
        trim: true,
        unique: true,
    },
    bkashPhoneNumber: {
        type: String,
        required: [true, 'bKash phone number is required'],
        trim: true,
    },
    status: {
        type: String,
        enum: ['pending', 'verified', 'rejected'],
        default: 'pending',
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    verifiedAt: {
        type: Date,
    },
    rejectionReason: {
        type: String,
        trim: true,
    },
    receiptUrl: {
        type: String,
    },
}, {
    timestamps: true,
});

// Indexes
paymentSchema.index({ bkashTransactionId: 1, status: 1 });
paymentSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
