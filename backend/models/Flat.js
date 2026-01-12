const mongoose = require('mongoose');

const flatSchema = new mongoose.Schema({
    buildingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Building',
        required: [true, 'Building reference is required'],
    },
    flatNumber: {
        type: String,
        required: [true, 'Flat number is required'],
        trim: true,
    },
    flatType: {
        type: String,
        enum: ['bachelor', 'family'],
        default: 'family',
    },
    floor: {
        type: Number,
        required: true,
        min: [0, 'Floor cannot be negative'],
    },
    area: {
        type: Number,
        required: [true, 'Area is required'],
        min: [1, 'Area must be positive'],
    },
    bedrooms: {
        type: Number,
        required: true,
        min: [0, 'Bedrooms cannot be negative'],
    },
    bathrooms: {
        type: Number,
        required: true,
        min: [0, 'Bathrooms cannot be negative'],
    },
    washrooms: {
        type: Number,
        min: [0, 'Washrooms cannot be negative'],
    },
    balconies: {
        type: Number,
        default: 0,
        min: [0, 'Balconies cannot be negative'],
    },
    kitchens: {
        type: Number,
        default: 1,
        min: [0, 'Kitchens cannot be negative'],
    },
    orientation: {
        type: String,
        enum: ['east', 'west', 'north', 'south', 'northeast', 'northwest', 'southeast', 'southwest'],
        default: 'east',
    },
    rent: {
        type: Number,
        required: [true, 'Rent is required'],
        min: [0, 'Rent cannot be negative'],
    },
    status: {
        type: String,
        enum: ['available', 'occupied', 'maintenance'],
        default: 'available',
    },
    currentTenant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    defaultMaintenance: {
        type: Number,
        default: 0,
        min: [0, 'Default maintenance cannot be negative'],
    },
    defaultCleaning: {
        type: Number,
        default: 0,
        min: [0, 'Default cleaning fee cannot be negative'],
    },
    defaultGarbage: {
        type: Number,
        default: 0,
        min: [0, 'Default garbage fee cannot be negative'],
    },
    amenities: [{
        type: String,
        trim: true,
    }],
    images: [{
        type: String,
    }],
    description: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

// Indexes for faster queries
flatSchema.index({ buildingId: 1, status: 1 });
flatSchema.index({ status: 1 });
flatSchema.index({ rent: 1 });

// Ensure washrooms defaults to bathrooms when not provided
flatSchema.pre('save', function (next) {
    if (this.washrooms === undefined || this.washrooms === null) {
        this.washrooms = this.bathrooms;
    }
    next();
});

module.exports = mongoose.model('Flat', flatSchema);
