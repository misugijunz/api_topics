const grpc = require('grpc');
const { CalculatorService } = require('./calculator_grpc_pb');

// Implement the Calculator service
const calculator = {
  add: (call, callback) => {
    const { num1, num2 } = call.request;
    const sum = num1 + num2;
    callback(null, { sum });
  },

  multiply: (call, callback) => {
    const { num1, num2 } = call.request;
    const product = num1 * num2;
    callback(null, { product });
  },
};

// Create a gRPC server
const server = new grpc.Server();
server.addService(CalculatorService, calculator);

// Start the server
server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
server.start();
console.log('Server running on port 50051');