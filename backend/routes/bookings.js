const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const validate = require('../middleware/validation');
const { validateBookingRequest } = require('../utils/validators');

router.post('/', auth, roleGuard(['tenant']), validateBookingRequest, validate, bookingController.createBooking);
router.get('/my-bookings', auth, bookingController.getMyBookings);

module.exports = router;
