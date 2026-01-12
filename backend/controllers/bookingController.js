const BookingRequest = require('../models/BookingRequest');

exports.createBooking = async (req, res) => {
    try {
        const booking = await BookingRequest.create({
            ...req.body,
            visitorId: req.user._id,
        });

        res.status(201).json({
            success: true,
            data: { booking },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await BookingRequest.find({ visitorId: req.user._id })
            .populate('flatId')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: { bookings },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
