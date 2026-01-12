const User = require('../models/User');
const { generateTokenPair, verifyRefreshToken } = require('../utils/tokenGenerator');

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
exports.register = async (req, res) => {
    try {
        const { username, email, password, role, firstName, lastName, phone } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User with this email or username already exists',
            });
        }

        // Create user
        const user = await User.create({
            username,
            email,
            password,
            role: role || 'visitor',
            firstName,
            lastName,
            phone,
        });

        // Generate tokens
        const { accessToken, refreshToken } = generateTokenPair(
            user._id,
            user.email,
            user.role
        );

        // Save refresh token to user
        user.refreshTokens.push(refreshToken);
        await user.save();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    firstName: user.firstName,
                    lastName: user.lastName,
                },
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user with password field
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokenPair(
            user._id,
            user.email,
            user.role
        );

        // Save refresh token
        user.refreshTokens.push(refreshToken);
        await user.save();

        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    profileImage: user.profileImage,
                    treePoints: user.treePoints,
                },
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @route   POST /api/auth/refresh
// @desc    Refresh access token
// @access  Public
exports.refresh = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                message: 'Refresh token is required',
            });
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired refresh token',
            });
        }

        // Find user and check if token exists
        const user = await User.findById(decoded.userId);
        if (!user || !user.refreshTokens.includes(refreshToken)) {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token',
            });
        }

        // Generate new tokens
        const newTokens = generateTokenPair(user._id, user.email, user.role);

        // Remove old refresh token and add new one
        user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
        user.refreshTokens.push(newTokens.refreshToken);
        await user.save();

        res.json({
            success: true,
            data: {
                accessToken: newTokens.accessToken,
                refreshToken: newTokens.refreshToken,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @route   POST /api/auth/logout
// @desc    Logout user
// @access  Private
exports.logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (refreshToken) {
            // Remove refresh token from user
            const user = await User.findById(req.user._id);
            user.refreshTokens = user.refreshTokens.filter(t => t !== refreshToken);
            await user.save();
        }

        res.json({
            success: true,
            message: 'Logout successful',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('flatId');

        res.json({
            success: true,
            data: { user },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { firstName, lastName, phone },
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: { user },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
