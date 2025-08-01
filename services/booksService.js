const Book = require("../models/book");
const mongoose = require("mongoose");

async function getAllBooks() {
  return await Book.find();
}

async function findBookById(id) {
  // id is already a valid ObjectId from controller
  return await Book.findById(id);
}

async function createBook(title, author) {
  const newBook = new Book({ title, author });
  return await newBook.save();
}

async function updateBook(id, title, author) {
  // id is already a valid ObjectId from controller
  const updated = await Book.findByIdAndUpdate(
    id,
    { title, author },
    { new: true }
  );
  return updated;
}

async function deleteBook(id) {
  // id is already a valid ObjectId from controller
  return await Book.findByIdAndDelete(id);
}

module.exports = {
  getAllBooks,
  findBookById,
  createBook,
  updateBook,
  deleteBook,
};
