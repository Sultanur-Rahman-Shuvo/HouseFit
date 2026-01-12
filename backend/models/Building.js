const mongoose = require('mongoose');

const buildingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Building name is required'],
        trim: true,
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
    },
    totalFloors: {
        type: Number,
        required: true,
        min: [1, 'Building must have at least 1 floor'],
    },
    totalFlats: {
        type: Number,
        required: true,
        min: [1, 'Building must have at least 1 flat'],
    },
    facilities: [{
        type: String,
        trim: true,
    }],
    managerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Building', buildingSchema);
