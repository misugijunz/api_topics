const express = require('express');
const bcrypt = require('bcrypt');

const app = express();
const apiTokenSecret = 'your-api-token-secret';

// Simulated user data
const users = [
  {
    id: 1,
    username: 'john',
    password: '$2b$10$KGkYfq2UgKETN5BF6t2SROesM9YD5K6gji7O9IzrEPuhN8oP2qAJW', // Hashed password: 'password'
    role: 'admin'
  },
  {
    id: 2,
    username: 'jane',
    password: '$2b$10$kfmJ0aJLNEGBndSjYKqkIu1PrxiYpt2a8A5d3x.Qp.Y4qES.BAkvK', // Hashed password: 'password'
    role: 'user'
  }
];

// Middleware for authentication
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  if (token !== apiTokenSecret) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  next();
}

// Middleware for authorization
function authorize(roles) {
  return (req, res, next) => {
    // Check if the user's role is authorized
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
}

// Endpoint for user login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Find user by username
  const user = users.find(user => user.username === username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  // Generate API token
  const apiToken = apiTokenSecret;

  res.json({ apiToken });
});

// Protected route for admin
app.get('/admin', authenticate, authorize(['admin']), (req, res) => {
  res.json({ message: 'Admin access granted' });
});

// Protected route for regular users
app.get('/user', authenticate, authorize(['user']), (req, res) => {
  res.json({ message: 'User access granted' });
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});