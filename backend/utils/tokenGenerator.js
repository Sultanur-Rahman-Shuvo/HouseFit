const jwt = require('jsonwebtoken');

// Generate access token
const generateAccessToken = (userId, email, role) => {
    return jwt.sign(
        { userId, email, role },
        process.env.JWT_ACCESS_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m' }
    );
};

// Generate refresh token
const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d' }
    );
};

// Verify refresh token
const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    } catch (error) {
        return null;
    }
};

// Generate both tokens
const generateTokenPair = (userId, email, role) => {
    const accessToken = generateAccessToken(userId, email, role);
    const refreshToken = generateRefreshToken(userId);

    return {
        accessToken,
        refreshToken,
    };
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    generateTokenPair,
};

