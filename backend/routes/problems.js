const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problemController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');
const { validateProblemReport } = require('../utils/validators');

router.post('/', auth, validateProblemReport, validate, problemController.createProblem);
router.get('/my-reports', auth, problemController.getMyProblems);
router.get('/:id', auth, problemController.getProblemById);

module.exports = router;
