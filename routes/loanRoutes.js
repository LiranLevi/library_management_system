const express = require('express');
const loanController = require('../controllers/loanController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/loanBook', authMiddleware, roleMiddleware(['customer', 'employee']), loanController.loanBook);
router.get('/returnBook/:loanId', authMiddleware, roleMiddleware(['customer', 'employee']), loanController.returnBook);
router.get('/getUserLoanes', authMiddleware, loanController.getUserLoans);

module.exports = router;