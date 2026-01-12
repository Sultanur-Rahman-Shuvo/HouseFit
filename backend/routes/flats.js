const express = require('express');
const router = express.Router();
const flatController = require('../controllers/flatController');
const auth = require('../middleware/auth');
const roleGuard = require('../middleware/roleGuard');

router.get('/', flatController.getAllFlats);
router.get('/search', flatController.searchFlats);
router.get('/my-flats', auth, roleGuard(['owner']), flatController.getMyFlats);
router.put('/my-flats/:id/fare', auth, roleGuard(['owner']), flatController.updateMyFlatFare);
router.get('/:id', flatController.getFlatById);

module.exports = router;
