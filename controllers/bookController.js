const Book = require('../models/bookModel');

exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

exports.createBook = async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).json(book);
    } catch (err) {
        res.status(400).json({ message: 'Invalid data' });
    }
};

exports.updateBook = async (req, res) => {
    try {
        //What we need to do if there is available field to update from "false" to "true" 
        //and there is a record for this book in lones table? delete the lone record? and vice versa.
        //Needs to check the validation of data here.
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!book) return res.status(404).json({ message: 'Book not found' });
        res.json(book);
    } catch (err) {
        res.status(400).json({ message: 'Invalid data' });
    }
};

exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) return res.status(404).json({ message: 'Book not found' });

        // Check if the book is on loan
        if (!book.available) {
            return res.status(400).json({ message: 'Cannot delete book while it is loaned' });
        }

        await book.deleteOne();
        res.json({ message: 'Book deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};