const express = require('express');
const router = express.Router();
const treeController = require('../controllers/treeController');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const upload = require('../utils/fileUpload');
const validate = require('../middleware/validation');
const { validateTreeSubmission } = require('../utils/validators');

router.post(
    '/submit',
    auth,
    roleGuard(['tenant']),
    upload.single('tree'),
    validateTreeSubmission,
    validate,
    treeController.submitTree
);
router.get('/my-submissions', auth, treeController.getMySubmissions);
router.get('/leaderboard', treeController.getLeaderboard);
router.get('/leaderboard/:month', treeController.getLeaderboard);

module.exports = router;
