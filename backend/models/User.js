const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false,
    },
    role: {
        type: String,
        enum: ['admin', 'owner', 'tenant', 'employee'],
        default: 'tenant',
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        match: [/^01[0-9]{9}$/, 'Valid Bangladeshi phone number required (01XXXXXXXXX)'],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    profileImage: {
        type: String,
        default: null,
    },
    flatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Flat',
        default: null,
    },
    refreshTokens: [{
        type: String,
    }],
    treePoints: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});

// Index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Method to get full name
userSchema.methods.getFullName = function () {
    return `${this.firstName} ${this.lastName}`;
};

// Indexes (username and email already indexed via unique: true)
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);
