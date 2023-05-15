const axios = require('axios');

// Set the GraphQL API endpoint URL
const API_URL = 'http://localhost:3000/graphql';

// Function to send a GraphQL request
async function sendGraphQLRequest(query, variables = {}) {
  try {
    const response = await axios.post(API_URL, {
      query: query,
      variables: variables
    });

    return response.data.data;
  } catch (error) {
    console.error('GraphQL request failed:', error.response.data);
    throw error;
  }
}

// Example GraphQL query
const queryBooks = `
  query {
    books {
      id
      title
      author
    }
  }
`;

// Example GraphQL mutation
const createBookMutation = `
  mutation ($title: String!, $author: String!) {
    createBook(title: $title, author: $author) {
      id
      title
      author
    }
  }
`;

// Send the query to fetch all books
sendGraphQLRequest(queryBooks)
  .then(data => {
    console.log('All Books:', data.books);
  })
  .catch(error => {
    console.error('Failed to fetch books:', error);
  });

// Send the mutation to create a new book
const newBookVariables = {
  title: 'New Book',
  author: 'John Doe'
};

sendGraphQLRequest(createBookMutation, newBookVariables)
  .then(data => {
    console.log('Created Book:', data.createBook);
  })
  .catch(error => {
    console.error('Failed to create book:', error);
  });