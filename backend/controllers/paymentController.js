const Payment = require('../models/Payment');
const Bill = require('../models/Bill');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendEmail } = require('../config/email');
const { paymentVerifiedTemplate, paymentRejectedTemplate } = require('../utils/emailTemplates');

// @route   POST /api/payments
// @desc    Submit payment
// @access  Private (Tenant)
exports.submitPayment = async (req, res) => {
    try {
        const { billId, amount, bkashTransactionId, bkashPhoneNumber } = req.body;

        // Check if bill exists
        const bill = await Bill.findById(billId);
        if (!bill) {
            return res.status(404).json({
                success: false,
                message: 'Bill not found',
            });
        }

        // Check if bill belongs to user
        if (bill.tenantId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to pay this bill',
            });
        }

        // Check if bill is already paid
        if (bill.status === 'paid') {
            return res.status(400).json({
                success: false,
                message: 'Bill already paid',
            });
        }

        // Create payment
        const payment = await Payment.create({
            billId,
            userId: req.user._id,
            amount,
            bkashTransactionId,
            bkashPhoneNumber,
            status: 'pending',
        });

        // Update bill status
        bill.status = 'pending-verification';
        bill.paymentId = payment._id;
        await bill.save();

        // Create notification for admin
        await Notification.create({
            recipientRole: 'admin',
            title: 'New Payment Submission',
            message: `${req.user.firstName} ${req.user.lastName} submitted a payment for verification`,
            type: 'info',
            category: 'payment',
            relatedId: payment._id,
            relatedModel: 'Payment',
        });

        res.status(201).json({
            success: true,
            message: 'Payment submitted successfully. Awaiting verification.',
            data: { payment },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @route   GET /api/payments/my-payments
// @desc    Get user's payments
// @access  Private
exports.getMyPayments = async (req, res) => {
    try {
        const payments = await Payment.find({ userId: req.user._id })
            .populate('billId')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: payments.length,
            data: { payments },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @route   GET /api/payments/:id
// @desc    Get payment details
// @access  Private
exports.getPaymentById = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate('billId')
            .populate('userId', 'firstName lastName email')
            .populate('verifiedBy', 'firstName lastName');

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: 'Payment not found',
            });
        }

        // Check authorization
        if (
            payment.userId._id.toString() !== req.user._id.toString() &&
            req.user.role !== 'admin'
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized',
            });
        }

        res.json({
            success: true,
            data: { payment },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
