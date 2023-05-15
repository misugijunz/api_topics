const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// Construct a schema using GraphQL schema language
const schema = buildSchema(`
  type Book {
    id: ID!
    title: String!
    author: String!
  }

  type Query {
    books: [Book!]!
    book(id: ID!): Book
  }

  type Mutation {
    createBook(title: String!, author: String!): Book!
    updateBook(id: ID!, title: String, author: String): Book
    deleteBook(id: ID!): Book
  }
`);

// Mock data - array of books
let books = [
  { id: '1', title: 'Book 1', author: 'Author 1' },
  { id: '2', title: 'Book 2', author: 'Author 2' },
  { id: '3', title: 'Book 3', author: 'Author 3' }
];

// Define resolvers for the schema
const root = {
  books: () => books,
  book: ({ id }) => books.find(book => book.id === id),
  createBook: ({ title, author }) => {
    const newBook = { id: String(books.length + 1), title, author };
    books.push(newBook);
    return newBook;
  },
  updateBook: ({ id, title, author }) => {
    const book = books.find(book => book.id === id);
    if (!book) return null;

    if (title) book.title = title;
    if (author) book.author = author;

    return book;
  },
  deleteBook: ({ id }) => {
    const bookIndex = books.findIndex(book => book.id === id);
    if (bookIndex === -1) return null;

    const deletedBook = books.splice(bookIndex, 1)[0];
    return deletedBook;
  },
};

// Create an Express app
const app = express();

// Define the GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, // Enable GraphiQL web interface for testing
}));

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
