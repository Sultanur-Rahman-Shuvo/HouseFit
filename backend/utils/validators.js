const { body, param, query } = require('express-validator');

// User registration validation
const validateRegistration = [
    body('username')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    body('firstName')
        .trim()
        .notEmpty()
        .withMessage('First name is required'),
    body('lastName')
        .trim()
        .notEmpty()
        .withMessage('Last name is required'),
    body('role')
        .optional()
        .isIn(['admin', 'owner', 'tenant', 'visitor', 'employee'])
        .withMessage('Invalid role'),
];

// User login validation
const validateLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];

// Flat creation validation
const validateFlat = [
    body('buildingId')
        .isMongoId()
        .withMessage('Valid building ID is required'),
    body('flatNumber')
        .trim()
        .notEmpty()
        .withMessage('Flat number is required'),
    body('floor')
        .isInt({ min: 0 })
        .withMessage('Floor must be a non-negative integer'),
    body('area')
        .isFloat({ min: 1 })
        .withMessage('Area must be a positive number'),
    body('bedrooms')
        .isInt({ min: 0 })
        .withMessage('Bedrooms must be a non-negative integer'),
    body('bathrooms')
        .isInt({ min: 0 })
        .withMessage('Bathrooms must be a non-negative integer'),
    body('rent')
        .isFloat({ min: 0 })
        .withMessage('Rent must be a non-negative number'),
    body('flatType')
        .optional()
        .isIn(['bachelor', 'family'])
        .withMessage('Flat type must be bachelor or family'),
    body('washrooms')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Washrooms must be a non-negative integer'),
    body('balconies')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Balconies must be a non-negative integer'),
    body('kitchens')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Kitchens must be a non-negative integer'),
    body('orientation')
        .optional()
        .isIn(['east', 'west', 'north', 'south', 'northeast', 'northwest', 'southeast', 'southwest'])
        .withMessage('Orientation is invalid'),
];

// Payment validation
const validatePayment = [
    body('billId')
        .isMongoId()
        .withMessage('Valid bill ID is required'),
    body('amount')
        .isFloat({ min: 0 })
        .withMessage('Amount must be a non-negative number'),
    body('bkashTransactionId')
        .trim()
        .notEmpty()
        .withMessage('bKash transaction ID is required'),
    body('bkashPhoneNumber')
        .trim()
        .matches(/^01[0-9]{9}$/)
        .withMessage('Valid Bangladeshi phone number required (01XXXXXXXXX)'),
];

// Tree submission validation
const validateTreeSubmission = [
    body('location')
        .trim()
        .notEmpty()
        .withMessage('Location is required'),
    body('plantedDate')
        .isISO8601()
        .withMessage('Valid planted date is required'),
];

// Problem report validation
const validateProblemReport = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required'),
    body('category')
        .isIn([
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
        ])
        .withMessage('Invalid category'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high', 'urgent'])
        .withMessage('Invalid priority'),
];

// Leave request validation
const validateLeaveRequest = [
    body('flatId')
        .isMongoId()
        .withMessage('Valid flat ID is required'),
    body('startDate')
        .isISO8601()
        .withMessage('Valid start date is required'),
    body('endDate')
        .isISO8601()
        .withMessage('Valid end date is required'),
    body('reason')
        .trim()
        .notEmpty()
        .withMessage('Reason is required'),
    body('emergencyContact')
        .trim()
        .notEmpty()
        .withMessage('Emergency contact is required'),
];

// Booking request validation
const validateBookingRequest = [
    body('flatId')
        .isMongoId()
        .withMessage('Valid flat ID is required'),
    body('message')
        .trim()
        .notEmpty()
        .withMessage('Message is required'),
    body('requestedDate')
        .isISO8601()
        .withMessage('Valid requested date is required'),
];

// MongoDB ObjectId validation
const validateObjectId = [
    param('id')
        .isMongoId()
        .withMessage('Invalid ID format'),
];

module.exports = {
    validateRegistration,
    validateLogin,
    validateFlat,
    validatePayment,
    validateTreeSubmission,
    validateProblemReport,
    validateLeaveRequest,
    validateBookingRequest,
    validateObjectId,
};

