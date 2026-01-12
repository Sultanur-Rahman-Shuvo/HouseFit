const express = require('express');
const router = express.Router();
const billController = require('../controllers/billController');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

router.get('/my-bills', auth, roleGuard(['tenant']), billController.getMyBills);
router.get('/:id', auth, billController.getBillById);
router.post('/generate', auth, roleGuard(['admin']), billController.generateBill);

module.exports = router;
