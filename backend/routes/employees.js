const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const SalaryRaise = require('../models/SalaryRaise');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

// All routes require employee role
router.use(auth, roleGuard(['employee']));

// Get my employee profile
router.get('/profile', async (req, res) => {
    try {
        const employee = await Employee.findOne({ userId: req.user._id }).populate('userId', 'firstName lastName email phone');

        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee profile not found' });
        }

        res.json({ success: true, data: { employee } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Request salary raise
router.post('/salary-raise', async (req, res) => {
    try {
        const { requestedSalary, reason } = req.body;

        const employee = await Employee.findOne({ userId: req.user._id });

        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee profile not found' });
        }

        // Check for pending requests
        const pendingRequest = await SalaryRaise.findOne({
            employeeId: employee._id,
            status: 'pending'
        });

        if (pendingRequest) {
            return res.status(400).json({
                success: false,
                message: 'You already have a pending salary raise request'
            });
        }

        const raise = await SalaryRaise.create({
            employeeId: employee._id,
            currentSalary: employee.salary,
            requestedSalary,
            reason,
        });

        res.status(201).json({
            success: true,
            message: 'Salary raise request submitted successfully',
            data: { raise }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Get my salary raise requests
router.get('/salary-raises', async (req, res) => {
    try {
        const employee = await Employee.findOne({ userId: req.user._id });

        if (!employee) {
            return res.status(404).json({ success: false, message: 'Employee profile not found' });
        }

        const raises = await SalaryRaise.find({ employeeId: employee._id })
            .sort({ createdAt: -1 });

        res.json({ success: true, data: { raises } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
