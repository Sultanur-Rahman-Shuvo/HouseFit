const express = require('express');
const router = express.Router();
const ollamaController = require('../controllers/ollamaController');

router.post('/flat-price', ollamaController.predictFlatPrice);
router.post('/area-suggestion', ollamaController.suggestArea);
router.post('/budget-from-area', ollamaController.budgetFromArea);

module.exports = router;
