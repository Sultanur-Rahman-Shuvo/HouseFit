const mongoose = require('mongoose');

const salaryRaiseSchema = new mongoose.Schema({
    employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    currentSalary: {
        type: Number,
        required: true,
        min: [0, 'Salary cannot be negative'],
    },
    requestedSalary: {
        type: Number,
        required: true,
        min: [0, 'Salary cannot be negative'],
    },
    reason: {
        type: String,
        required: [true, 'Reason is required'],
        trim: true,
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
salaryRaiseSchema.index({ employeeId: 1, status: 1 });
salaryRaiseSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('SalaryRaise', salaryRaiseSchema);
