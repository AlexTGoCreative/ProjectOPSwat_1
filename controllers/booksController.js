
const booksService = require('../services/booksService');
const { validationResult } = require('express-validator');
const { Types } = require('mongoose');

function getBooksFromDB() {
    throw new Error('Database connection failed');
}

exports.getAllBooks = async (req, res) => {
    try {
        const books = await booksService.getAllBooks();
        res.status(200).json(books);
    } catch (error) {
        console.log('Error in getAllBooks:', error.message);
        res.status(200).json([]);
    }
};


exports.getBookById = async (req, res) => {
    try {
        const bookId = req.params.id;
        if (!Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({ error: 'Invalid book ID' });
        }
        const book = await booksService.findBookById(new Types.ObjectId(bookId));
        console.log(bookId);
        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).send('Book not found');
        }
    } catch (error) {
        console.log('Error in getBookById:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.headBookById = async (req, res) => {
    try {
        const bookId = req.params.id;
        if (!Types.ObjectId.isValid(bookId)) {
            return res.status(400).end();
        }
        const book = await booksService.findBookById(new Types.ObjectId(bookId));
        if (book) {
            res.status(200).end();
        } else {
            res.status(404).end();
        }
    } catch (error) {
        console.log('Error in headBookById:', error.message);
        res.status(500).end();
    }
};

exports.createBook = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Title and author are required." });
    }
    try {
        const { title, author } = req.body;
        const newBook = await booksService.createBook(title, author);
        res.status(201).json(newBook);
    } catch (error) {
        console.log('Error in createBook:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.updateBook = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: "Title and author are required." });
    }
    try {
        const bookId = req.params.id;
        if (!Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({ error: 'Invalid book ID' });
        }
        const { title, author } = req.body;
        const updatedBook = await booksService.updateBook(new Types.ObjectId(bookId), title, author);
        if (updatedBook) {
            res.status(200).json(updatedBook);
        } else {
            res.status(404).send('Book not found');
        }
    } catch (error) {
        console.log('Error in updateBook:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.deleteBook = async (req, res) => {
    try {
        const bookId = req.params.id;
        if (!Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({ error: 'Invalid book ID' });
        }
        const deletedBook = await booksService.deleteBook(new Types.ObjectId(bookId));
        if (deletedBook) {
            res.status(200).json(deletedBook);
        } else {
            res.status(404).send('Book not found');
        }
    } catch (error) {
        console.log('Error in deleteBook:', error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};
