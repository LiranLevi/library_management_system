const express = require('express');
const bookController = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.get('/getAllBooks', authMiddleware, bookController.getAllBooks);
router.get('/getBookById/:id', authMiddleware, bookController.getBookById);
router.post('/createBook', authMiddleware, roleMiddleware(['employee']), bookController.createBook);
router.put('/updateBook/:id', authMiddleware, roleMiddleware(['employee']), bookController.updateBook);
router.delete('/deleteBook/:id', authMiddleware, roleMiddleware(['employee']), bookController.deleteBook);

module.exports = router;