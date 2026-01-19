const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    employeeId: {
        type: String,
        required: [true, 'Employee ID is required'],
        unique: true,
        trim: true,
    },
    department: {
        type: String,
        enum: ['electrician', 'cleaner', 'gas', 'plumber', 'security', 'helper', 'maintenance', 'management', 'maid'],
        required: true,
    },
    designation: {
        type: String,
        required: true,
        trim: true,
    },
    salary: {
        type: Number,
        required: true,
        min: [0, 'Salary cannot be negative'],
    },
    joinDate: {
        type: Date,
        required: true,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'on-leave'],
        default: 'active',
    },
    assignedTasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProblemReport',
    }],
}, {
    timestamps: true,
});

// Index (employeeId already indexed via unique: true)
employeeSchema.index({ userId: 1 });

module.exports = mongoose.model('Employee', employeeSchema);
