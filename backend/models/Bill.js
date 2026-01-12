const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    flatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat',
        required: true,
    },
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    month: {
        type: String,
        required: true,
        match: [/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format'],
    },
    rent: {
        type: Number,
        required: true,
        min: [0, 'Rent cannot be negative'],
    },
    electricity: {
        type: Number,
        default: 0,
        min: [0, 'Electricity bill cannot be negative'],
    },
    gas: {
        type: Number,
        default: 0,
        min: [0, 'Gas bill cannot be negative'],
    },
    water: {
        type: Number,
        default: 0,
        min: [0, 'Water bill cannot be negative'],
    },
    maintenance: {
        type: Number,
        default: 0,
        min: [0, 'Maintenance charge cannot be negative'],
    },
    cleaning: {
        type: Number,
        default: 0,
        min: [0, 'Cleaning fee cannot be negative'],
    },
    garbage: {
        type: Number,
        default: 0,
        min: [0, 'Garbage fee cannot be negative'],
    },
    discount: {
        type: Number,
        default: 0,
        min: [0, 'Discount cannot be negative'],
    },
    total: {
        type: Number,
        required: true,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['unpaid', 'pending-verification', 'paid'],
        default: 'unpaid',
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
    },
    generatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

// Indexes
billSchema.index({ tenantId: 1, month: -1 });
billSchema.index({ status: 1 });

// Calculate total before saving
billSchema.pre('save', function (next) {
    this.total = this.rent
        + this.electricity
        + this.gas
        + this.water
        + this.maintenance
        + this.cleaning
        + this.garbage
        - this.discount;
    next();
});

module.exports = mongoose.model('Bill', billSchema);
