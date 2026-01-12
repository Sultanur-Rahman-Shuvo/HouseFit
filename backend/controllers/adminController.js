const Building = require('../models/Building');
const Flat = require('../models/Flat');
const Employee = require('../models/Employee');
const Payment = require('../models/Payment');
const Bill = require('../models/Bill');
const BookingRequest = require('../models/BookingRequest');
const TreeSubmission = require('../models/TreeSubmission');
const LeaveRequest = require('../models/LeaveRequest');
const ProblemReport = require('../models/ProblemReport');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendEmail } = require('../config/email');
const {
    paymentVerifiedTemplate,
    paymentRejectedTemplate,
    bookingApprovedTemplate,
    treeApprovedTemplate,
    leaveApprovedTemplate,
} = require('../utils/emailTemplates');

// Buildings
exports.createBuilding = async (req, res) => {
    try {
        const building = await Building.create({
            ...req.body,
            managerId: req.user._id,
        });

        res.status(201).json({
            success: true,
            data: { building },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAllBuildings = async (req, res) => {
    try {
        const buildings = await Building.find().populate('managerId', 'firstName lastName');
        res.json({ success: true, data: { buildings } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Flats
exports.createFlat = async (req, res) => {
    try {
        const flat = await Flat.create(req.body);
        res.status(201).json({ success: true, data: { flat } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateFlat = async (req, res) => {
    try {
        const flat = await Flat.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!flat) {
            return res.status(404).json({ success: false, message: 'Flat not found' });
        }

        res.json({ success: true, data: { flat } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteFlat = async (req, res) => {
    try {
        const flat = await Flat.findByIdAndDelete(req.params.id);

        if (!flat) {
            return res.status(404).json({ success: false, message: 'Flat not found' });
        }

        res.json({ success: true, message: 'Flat deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Payments
exports.getPendingPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ status: 'pending' })
            .populate('userId', 'firstName lastName email')
            .populate('billId')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: { payments } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id).populate('userId billId');

        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        payment.status = 'verified';
        payment.verifiedBy = req.user._id;
        payment.verifiedAt = Date.now();
        await payment.save();

        // Update bill
        const bill = await Bill.findById(payment.billId);
        bill.status = 'paid';
        await bill.save();

        // Send email
        await sendEmail({
            to: payment.userId.email,
            subject: 'Payment Verified',
            html: paymentVerifiedTemplate({
                userName: payment.userId.getFullName(),
                billMonth: bill.month,
                amount: payment.amount,
                transactionId: payment.bkashTransactionId,
            }),
        });

        res.json({ success: true, message: 'Payment verified', data: { payment } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.rejectPayment = async (req, res) => {
    try {
        const { reason } = req.body;
        const payment = await Payment.findById(req.params.id).populate('userId billId');

        if (!payment) {
            return res.status(404).json({ success: false, message: 'Payment not found' });
        }

        payment.status = 'rejected';
        payment.rejectionReason = reason;
        payment.verifiedBy = req.user._id;
        payment.verifiedAt = Date.now();
        await payment.save();

        // Update bill
        const bill = await Bill.findById(payment.billId);
        bill.status = 'unpaid';
        bill.paymentId = null;
        await bill.save();

        // Send email
        await sendEmail({
            to: payment.userId.email,
            subject: 'Payment Rejected',
            html: paymentRejectedTemplate({
                userName: payment.userId.getFullName(),
                transactionId: payment.bkashTransactionId,
                reason,
            }),
        });

        res.json({ success: true, message: 'Payment rejected', data: { payment } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Employees
exports.createEmployee = async (req, res) => {
    try {
        const employee = await Employee.create(req.body);
        res.status(201).json({ success: true, data: { employee } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getEmployees = async (req, res) => {
    try {
        const { department, status } = req.query;
        const query = {};
        if (department) query.department = department;
        if (status) query.status = status;

        const employees = await Employee.find(query)
            .populate('userId', 'firstName lastName email phone');

        res.json({ success: true, data: { employees } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        res.json({ success: true, data: { employee } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }
        res.json({ success: true, message: 'Employee deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Trees
exports.getAllTrees = async (req, res) => {
    try {
        const trees = await TreeSubmission.find()
            .populate('userId', 'firstName lastName')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: { trees } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.approveTree = async (req, res) => {
    try {
        const { adminDecision } = req.body;
        const tree = await TreeSubmission.findById(req.params.id).populate('userId');

        if (!tree) {
            return res.status(404).json({ success: false, message: 'Tree submission not found' });
        }

        const points = parseInt(process.env.TREE_REWARD_POINTS) || 10;

        tree.status = 'approved';
        tree.pointsAwarded = points;
        tree.adminDecision = adminDecision;
        tree.reviewedBy = req.user._id;
        tree.reviewedAt = Date.now();
        await tree.save();

        // Award points to user
        const user = await User.findById(tree.userId);
        user.treePoints += points;
        await user.save();

        // Send email
        await sendEmail({
            to: user.email,
            subject: 'Tree Plantation Approved!',
            html: treeApprovedTemplate({
                userName: user.getFullName(),
                points,
                location: tree.location,
            }),
        });

        res.json({ success: true, message: 'Tree approved', data: { tree } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.rejectTree = async (req, res) => {
    try {
        const { adminDecision } = req.body;
        const tree = await TreeSubmission.findById(req.params.id);

        if (!tree) {
            return res.status(404).json({ success: false, message: 'Tree submission not found' });
        }

        tree.status = 'rejected';
        tree.adminDecision = adminDecision;
        tree.reviewedBy = req.user._id;
        tree.reviewedAt = Date.now();
        await tree.save();

        res.json({ success: true, message: 'Tree rejected', data: { tree } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.awardTopTreeUser = async (req, res) => {
    try {
        const topUser = await User.findOne({ role: 'tenant' }).sort({ treePoints: -1 });

        if (!topUser || topUser.treePoints <= 0) {
            return res.status(404).json({ success: false, message: 'No eligible users with tree points' });
        }

        const bill = await Bill.findOne({ tenantId: topUser._id, status: { $ne: 'paid' } })
            .sort({ month: -1 });

        if (!bill) {
            return res.status(404).json({ success: false, message: 'No unpaid/pending bill found for top user' });
        }

        bill.discount += 1000;
        await bill.save();

        await Notification.create({
            recipientId: topUser._id,
            title: 'Tree Points Reward Applied',
            message: 'You earned the monthly tree reward. A 1000 BDT discount has been applied to your latest bill.',
            type: 'success',
            category: 'bill',
        });

        res.json({ success: true, message: 'Top tree reward applied', data: { bill, user: topUser } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Bookings
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await BookingRequest.find()
            .populate('visitorId', 'firstName lastName email')
            .populate('flatId')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: { bookings } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.approveBooking = async (req, res) => {
    try {
        const { adminResponse } = req.body;
        const booking = await BookingRequest.findById(req.params.id)
            .populate('visitorId flatId');

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        booking.status = 'approved';
        booking.adminResponse = adminResponse;
        booking.reviewedBy = req.user._id;
        booking.reviewedAt = Date.now();
        await booking.save();

        // Send email
        await sendEmail({
            to: booking.visitorId.email,
            subject: 'Booking Request Approved',
            html: bookingApprovedTemplate({
                userName: booking.visitorId.getFullName(),
                flatNumber: booking.flatId.flatNumber,
                requestedDate: booking.requestedDate.toDateString(),
            }),
        });

        res.json({ success: true, message: 'Booking approved', data: { booking } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Leave
exports.getAllLeaveRequests = async (req, res) => {
    try {
        const requests = await LeaveRequest.find()
            .populate('userId', 'firstName lastName')
            .populate('flatId')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: { requests } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.approveLeave = async (req, res) => {
    try {
        const { adminNotes } = req.body;
        const leave = await LeaveRequest.findById(req.params.id).populate('userId');

        if (!leave) {
            return res.status(404).json({ success: false, message: 'Leave request not found' });
        }

        leave.status = 'approved';
        leave.adminNotes = adminNotes;
        leave.reviewedBy = req.user._id;
        leave.reviewedAt = Date.now();
        await leave.save();

        // Set flat to available/to-let
        const flat = await Flat.findById(leave.flatId);
        if (flat) {
            flat.status = 'available';
            flat.currentTenant = null;
            await flat.save();
        }

        // Send email
        await sendEmail({
            to: leave.userId.email,
            subject: 'Leave Request Approved',
            html: leaveApprovedTemplate({
                userName: leave.userId.getFullName(),
                startDate: leave.startDate.toDateString(),
                endDate: leave.endDate.toDateString(),
            }),
        });

        res.json({ success: true, message: 'Leave approved', data: { leave } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Problems
exports.getAllProblems = async (req, res) => {
    try {
        const problems = await ProblemReport.find()
            .populate('reportedBy', 'firstName lastName')
            .populate('flatId')
            .populate('assignedTo')
            .sort({ priority: -1, createdAt: -1 });

        res.json({ success: true, data: { problems } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.assignProblem = async (req, res) => {
    try {
        const { employeeId } = req.body;
        const problem = await ProblemReport.findById(req.params.id);

        if (!problem) {
            return res.status(404).json({ success: false, message: 'Problem not found' });
        }

        problem.assignedTo = employeeId;
        problem.assignedAt = Date.now();
        problem.status = 'assigned';
        await problem.save();

        res.json({ success: true, message: 'Problem assigned', data: { problem } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Notifications
exports.broadcastNotification = async (req, res) => {
    try {
        const { title, message, recipientRole, type } = req.body;

        await Notification.create({
            recipientRole: recipientRole || 'all',
            title,
            message,
            type: type || 'info',
            category: 'general',
        });

        res.json({ success: true, message: 'Notification sent' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
