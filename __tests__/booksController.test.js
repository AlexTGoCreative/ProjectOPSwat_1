const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const booksController = require('../controllers/booksController');
const booksService = require('../services/booksService');
const { body } = require('express-validator');

jest.mock('../services/booksService');

const app = express();
app.use(bodyParser.json());
app.post(
  '/books',
  [
    body('title')
      .notEmpty()
      .trim()
      .escape()
      .matches(/^[^$\\.]*$/), // Prevent $ and . for NoSQL injection
    body('author')
      .notEmpty()
      .trim()
      .escape()
      .matches(/^[^$\\.]*$/)
  ],
  booksController.createBook
);
app.get(
  '/books/:id',
  [
    // Sanitize id param to prevent NoSQL injection
    require('express-validator').param('id').trim().escape().matches(/^[a-fA-F0-9]{24}$/)
  ],
  booksController.getBookById
);

describe('Books API', () => {
    describe('POST /books', () => {
        it('should create a new book and return 201', async () => {
            const newBook = { _id: '507f1f77bcf86cd799439011', title: 'Test Book', author: 'Test Author' };
            booksService.createBook.mockResolvedValue(newBook);

            const res = await request(app)
                .post('/books')
                .send({ title: 'Test Book', author: 'Test Author' });

            expect(res.statusCode).toBe(201);
            expect(res.body).toEqual(newBook);
        });

        it('should return 400 if title or author is missing', async () => {
            const res = await request(app)
                .post('/books')
                .send({ title: '' });
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });
    });

    describe('GET /books/:id', () => {
        it('should return a book if found', async () => {
            const book = { _id: '507f1f77bcf86cd799439011', title: 'Test Book', author: 'Test Author' };
            booksService.findBookById.mockResolvedValue(book);

            const res = await request(app).get('/books/507f1f77bcf86cd799439011');
            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual(book);
        });

        it('should return 404 if book not found', async () => {
            booksService.findBookById.mockResolvedValue(null);
            const res = await request(app).get('/books/507f1f77bcf86cd799439012');
            expect(res.statusCode).toBe(404);
        });

        it('should return 400 for invalid book id', async () => {
            const res = await request(app).get('/books/invalidid');
            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error');
        });
    });
});
