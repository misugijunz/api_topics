exports.login = async (context, event, callback) => {
    if (event.request.method !== 'POST') {
      const response = new Twilio.Response();
      response.setStatusCode(405);
      response.setBody({ message: 'Method Not Allowed' });
      return callback(null, response);
    }
  
    const { username, password } = JSON.parse(event.body);
  
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
  
    // Find user by username
    const user = users.find((user) => user.username === username);
  
    if (!user || !(await bcrypt.compare(password, user.password))) {
      const response = new Twilio.Response();
      response.setStatusCode(401);
      response.setBody({ message: 'Invalid credentials' });
      return callback(null, response);
    }
  
    // Generate API token
    const apiToken = 'your-api-token-secret';
  
    const response = new Twilio.Response();
    response.setStatusCode(200);
    response.setBody({ apiToken });
    callback(null, response);
  };
  
  exports.admin = (context, event, callback) => {
    if (event.request.method !== 'GET') {
      const response = new Twilio.Response();
      response.setStatusCode(405);
      response.setBody({ message: 'Method Not Allowed' });
      return callback(null, response);
    }
  
    const authHeader = event.headers.Authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const response = new Twilio.Response();
      response.setStatusCode(401);
      response.setBody({ message: 'Unauthorized' });
      return callback(null, response);
    }
  
    const token = authHeader.split(' ')[1];
  
    if (token !== 'your-api-token-secret') {
      const response = new Twilio.Response();
      response.setStatusCode(401);
      response.setBody({ message: 'Unauthorized' });
      return callback(null, response);
    }
  
    const userRole = 'admin';
  
    if (!['admin'].includes(userRole)) {
      const response = new Twilio.Response();
      response.setStatusCode(403);
      response.setBody({ message: 'Forbidden' });
      return callback(null, response);
    }
  
    const response = new Twilio.Response();
    response.setStatusCode(200);
    response.setBody({ message: 'Admin access granted' });
    callback(null, response);
  };
  
  exports.user = (context, event, callback) => {
    if (event.request.method !== 'GET') {
      const response = new Twilio.Response();
      response.setStatusCode(405);
      response.setBody({ message: 'Method Not Allowed' });
      return callback(null, response);
    }
  
    const authHeader = event.headers.Authorization;
  
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const response = new Twilio.Response();
      response.setStatusCode(401);
      response.setBody({ message: 'Unauthorized' });
        return callback(null, response);
    }

    const token = authHeader.split(' ')[1];

    if (token !== 'your-api-token-secret') {
        const response = new Twilio.Response();
        response.setStatusCode(401);
        response.setBody({ message: 'Unauthorized' });
        return callback(null, response);
    }

    const userRole = 'user';

    if (!['admin', 'user'].includes(userRole)) {
        const response = new Twilio.Response();
        response.setStatusCode(403);
        response.setBody({ message: 'Forbidden' });
        return callback(null, response);
    }

    const response = new Twilio.Response();
    response.setStatusCode(200);
    response.setBody({ message: 'User access granted' });
    callback(null, response);
};

//put each exports to the respective URI target and change each to exports.handler