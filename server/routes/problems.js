const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problemController');
const isAdmin = require('../middleware/isAdmin');

router.post('/', isAdmin, problemController.createProblem);
router.put('/:id', isAdmin, problemController.updateProblem);
router.delete('/:id', isAdmin, problemController.deleteProblem);

router.get('/', problemController.getProblems);
router.get('/:id', problemController.getProblemById);

module.exports = router; 
