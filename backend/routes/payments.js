const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');
const validate = require('../middleware/validation');
const { validatePayment, validateObjectId } = require('../utils/validators');

router.post('/', auth, roleGuard(['tenant']), validatePayment, validate, paymentController.submitPayment);
router.get('/my-payments', auth, paymentController.getMyPayments);
router.get('/:id', auth, validateObjectId, validate, paymentController.getPaymentById);

module.exports = router;
