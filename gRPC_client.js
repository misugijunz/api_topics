const grpc = require('grpc');
const { AddRequest, MultiplyRequest } = require('./calculator_pb');
const { CalculatorService } = require('./calculator_grpc_pb');

// Create a gRPC client
const client = new CalculatorService('localhost:50051', grpc.credentials.createInsecure());

// Make gRPC calls
const addRequest = new AddRequest();
addRequest.setNum1(5);
addRequest.setNum2(3);

client.add(addRequest, (error, response) => {
  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log('Add Result:', response.getSum());
});

const multiplyRequest = new MultiplyRequest();
multiplyRequest.setNum1(4);
multiplyRequest.setNum2(2);

client.multiply(multiplyRequest, (error, response) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
 
    console.log('Multiply Result:', response.getProduct());
});
