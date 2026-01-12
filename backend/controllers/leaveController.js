const LeaveRequest = require('../models/LeaveRequest');

exports.createLeaveRequest = async (req, res) => {
    try {
        const leave = await LeaveRequest.create({
            ...req.body,
            userId: req.user._id,
        });

        res.status(201).json({
            success: true,
            data: { leave },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getMyLeaveRequests = async (req, res) => {
    try {
        const requests = await LeaveRequest.find({ userId: req.user._id })
            .populate('flatId')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: { requests },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
