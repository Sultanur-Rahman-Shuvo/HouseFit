const express = require('express');
const router = express.Router();
const leaveController = require('../controllers/leaveController');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const validate = require('../middleware/validation');
const { validateLeaveRequest } = require('../utils/validators');

router.post('/', auth, roleGuard(['tenant']), validateLeaveRequest, validate, leaveController.createLeaveRequest);
router.get('/my-requests', auth, leaveController.getMyLeaveRequests);

module.exports = router;
