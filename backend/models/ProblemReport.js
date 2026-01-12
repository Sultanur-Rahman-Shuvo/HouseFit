const mongoose = require('mongoose');

const problemReportSchema = new mongoose.Schema({
    reportedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    flatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat',
    },
    buildingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Building',
    },
    category: {
        type: String,
        enum: [
            'electricity',
            'water-supply',
            'cleaning',
            'gas',
            'garbage',
            'sanitary',
            'plumbing',
            'electrical',
            'maintenance',
            'security',
            'other',
        ],
        required: true,
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium',
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
    },
    images: [{
        type: String,
    }],
    status: {
        type: String,
        enum: ['open', 'assigned', 'in-progress', 'resolved', 'closed'],
        default: 'open',
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
    },
    assignedAt: {
        type: Date,
    },
    resolvedAt: {
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
problemReportSchema.index({ status: 1, priority: -1, createdAt: -1 });
problemReportSchema.index({ reportedBy: 1 });

module.exports = mongoose.model('ProblemReport', problemReportSchema);
