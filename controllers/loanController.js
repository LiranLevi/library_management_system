const Loan = require('../models/loanModel');
const Book = require('../models/bookModel');
const mongoose = require('mongoose');
const config = require('../config');
const { convertDaysToMiliSec } = require('../utils/utils');

const calculateDueDate = (rating) => {
    const stars = config.loanDueTimeByStarsMap[rating] || 7;
    return new Date(Date.now() + convertDaysToMiliSec(stars));
};

//Without concurrency
exports.loanBook = async (req, res) => {
    try {
        const { userId, bookId } = req.body;

        // Check if user has 5 active loans
        const activeLoans = await Loan.countDocuments({ user: userId, returnDate: null });
        if (activeLoans >= config.maxBooksBorrowedAtaTime) {
            return res.status(400).json({ message: `Cannot borrow more than ${config.maxBooksBorrowedAtaTime} books` });
        }

        // Check if the book is available
        const book = await Book.findById(bookId);
        if (!book || !book.available) {
            return res.status(400).json({ message: 'Book not available' });
        }

        // Loan the book
        const dueDate = calculateDueDate(book.rating);
        const loan = new Loan({ user: userId, book: bookId, dueDate });
        await loan.save();

        // Mark the book as unavailable
        book.available = false;
        await book.save();

        res.status(201).json(loan);
    } catch (err) {
        res.status(500).json({ message: 'Loan process failed' });
    }
};

//With concurrency
// exports.loanBook = async (req, res) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//         const { userId, bookId } = req.body;

//         // Check if user has 5 active loans
//         const activeLoans = await Loan.countDocuments({ user: userId, returnDate: null }).session(session);
//         if (activeLoans >= config.maxBooksBorrowedAtaTime) {
//             await session.abortTransaction();
//             return res.status(400).json({ message: `Cannot borrow more than ${config.maxBooksBorrowedAtaTime} books` });
//         }

//         // Check if the book is available
//         const book = await Book.findById(bookId).session(session);
//         if (!book || !book.available) {
//             await session.abortTransaction();
//             return res.status(400).json({ message: 'Book not available' });
//         }

//         // Loan the book
//         const dueDate = calculateDueDate(book.rating);
//         const loan = new Loan({ user: userId, book: bookId, dueDate });
//         await loan.save({ session });

//         // Mark the book as unavailable
//         book.available = false;
//         await book.save({ session });

//         await session.commitTransaction();
//         session.endSession();
//         res.status(201).json(loan);
//     } catch (err) {
//         await session.abortTransaction();
//         session.endSession();
//         res.status(500).json({ message: 'Loan process failed' });
//     }
// };

exports.returnBook = async (req, res) => {
    try {
        const loan = await Loan.findById(req.params.loanId);
        if (!loan || loan.returnDate) return res.status(400).json({ message: 'Invalid loan ID or already returned' });

        // Mark book as available again
        const book = await Book.findById(loan.book);
        book.available = true;
        await book.save();

        // Mark the loan as returned
        loan.returnDate = new Date();
        await loan.save();
        res.json(loan);
    } catch (err) {
        res.status(500).json({ message: 'Failed to return book' });
    }
};

exports.getUserLoans = async (req, res) => {
    try {
        const loans = await Loan.find({ user: req.user._id }).populate('book');
        res.status(200).json(loans);
    } catch (err) {
        res.status(500).json({ message: 'Failed to get user lones' });
    }
};