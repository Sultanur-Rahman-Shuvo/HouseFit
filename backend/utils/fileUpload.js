const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const ensureDirectoryExists = (directory) => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
};

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'uploads/';

        // Determine folder based on field name
        if (file.fieldname === 'tree') {
            uploadPath += 'trees/';
        } else if (file.fieldname === 'flat') {
            uploadPath += 'flats/';
        } else if (file.fieldname === 'profile') {
            uploadPath += 'profiles/';
        } else if (file.fieldname === 'problem') {
            uploadPath += 'problems/';
        } else {
            uploadPath += 'misc/';
        }

        ensureDirectoryExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const userId = req.user ? req.user._id : 'anonymous';
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const filename = `${file.fieldname}_${userId}_${timestamp}${ext}`;
        cb(null, filename);
    },
});

// File filter
const fileFilter = (req, file, cb) => {
    // Accept images only
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and GIF images are allowed.'), false);
    }
};

// Create multer instance
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880, // 5MB default
    },
});

module.exports = upload;

~
~
~
~
~
~
~
~
~
~
~
~
~
~
~
~
~
~
~
~
~
fileUpload.js [unix] (14:51 12/01/2026)                                  0,1 All
-- INSERT --

