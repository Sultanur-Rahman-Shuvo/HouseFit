const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

// All routes require admin role
router.use(auth, roleGuard(['admin']));

// Buildings
router.post('/buildings', adminController.createBuilding);
router.get('/buildings', adminController.getAllBuildings);

// Flats
router.post('/flats', adminController.createFlat);
router.put('/flats/:id', adminController.updateFlat);
router.delete('/flats/:id', adminController.deleteFlat);

// Payments
router.get('/payments/pending', adminController.getPendingPayments);
router.post('/payments/:id/verify', adminController.verifyPayment);
router.post('/payments/:id/reject', adminController.rejectPayment);

// Employees
router.post('/employees', adminController.createEmployee);
router.get('/employees', adminController.getEmployees);
router.put('/employees/:id', adminController.updateEmployee);
router.delete('/employees/:id', adminController.deleteEmployee);

// Bookings
router.get('/bookings', adminController.getAllBookings);
router.post('/bookings/:id/approve', adminController.approveBooking);

// Trees
router.get('/trees', adminController.getAllTrees);
router.post('/trees/:id/approve', adminController.approveTree);
router.post('/trees/:id/reject', adminController.rejectTree);
router.post('/trees/award-top', adminController.awardTopTreeUser);

// Leave
router.get('/leave', adminController.getAllLeaveRequests);
router.post('/leave/:id/approve', adminController.approveLeave);

// Problems
router.get('/problems', adminController.getAllProblems);
router.post('/problems/:id/assign', adminController.assignProblem);

// Notifications
router.post('/notifications/broadcast', adminController.broadcastNotification);

module.exports = router;
