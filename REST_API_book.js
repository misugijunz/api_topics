const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// Configure body-parser middleware to parse request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Mock data - array of books
let books = [
  { id: 1, title: 'Book 1', author: 'Author 1' },
  { id: 2, title: 'Book 2', author: 'Author 2' },
  { id: 3, title: 'Book 3', author: 'Author 3' }
];

// Get all books
app.get('/books', (req, res) => {
  res.json(books);
});

// Get a specific book by ID
app.get('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find((b) => b.id === bookId);

  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// Create a new book
app.post('/books', (req, res) => {
  const { title, author } = req.body;

  // Generate a new ID for the book
  const newBookId = books.length + 1;

  // Create a new book object
  const newBook = {
    id: newBookId,
    title: title,
    author: author
  };

  // Add the new book to the array
  books.push(newBook);

  res.status(201).json(newBook);
});

// Update an existing book by ID
app.put('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const { title, author } = req.body;

  // Find the book to update
  const book = books.find((b) => b.id === bookId);

  if (book) {
    // Update the book's title and author
    book.title = title;
    book.author = author;

    res.json(book);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// Partially update an existing book by ID
app.patch('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const updates = req.body;

  // Find the book to update
  const book = books.find((b) => b.id === bookId);

  if (book) {
    // Apply the updates to the book
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        book[key] = updates[key];
      }
    }

    res.json(book);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// Delete a book by ID
app.delete('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);

  // Find the index of the book in the array
  const bookIndex = books.findIndex((b) => b.id === bookId);

  if (bookIndex !== -1) {
    // Remove the book from the array
    const deletedBook = books.splice(bookIndex, 1)[0];
    res.json(deletedBook);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on port 3000');
});
