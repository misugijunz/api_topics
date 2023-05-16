const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const secretKey = 'your-secret-key';

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
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user = decoded;
    next();
  });
}

// Middleware for authorization
function authorize(roles) {
  return (req, res, next) => {
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

  // Generate JWT token
  const token = jwt.sign({ id: user.id, role: user.role }, secretKey);

  res.json({ token });
});

// Protected route for admin
app.get('/admin', authenticate, authorize(['admin']), (req, res) => {
  res.json({ message: 'Admin access granted' });
});

// Protected route for regular users
app.get('/user', authenticate, authorize(['user']), (req, res) => {
  res.json({ message: 'User access granted' });
});

// Input validation middleware
app.use(express.json());
app.use((req, res, next) => {
    // Perform input validation here
  
    // Example: Validate required fields, data types, length, etc.
    const { username, password } = req.body;
  
    // Validate required fields
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }
  
    // Validate data types
    if (typeof username !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ message: 'Invalid data types' });
    }
  
    // Validate length
    if (username.length < 4 || username.length > 20) {
      return res.status(400).json({ message: 'Username must be between 4 and 20 characters long' });
    }
  
    if (password.length < 6 || password.length > 20) {
      return res.status(400).json({ message: 'Password must be between 6 and 20 characters long' });
    }
  
    // Example: Validate valid inputs
    const validRoles = ['admin', 'user'];
    const { role } = req.body;
  
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
  
    next();
  });

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});
