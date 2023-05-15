const express = require('express');
const app = express();
const xml2js = require('xml2js');
const soap = require('soap');
const fs = require('fs');

// Load the WSDL file
const wsdl = fs.readFileSync('wsdl_example.wsdl', 'utf-8');

// Define a route to handle the SOAP requests
app.post('/weather/service', (req, res) => {
  // Parse the SOAP request body
  let body = '';
  req.on('data', (data) => {
    body += data;
  });

  req.on('end', () => {
    // Extract the city parameter from the SOAP envelope
    extractCityFromBody(body)
      .then((city) => {
        // Fetch the temperature for the specified city (mock implementation)
        const temperature = getTemperatureForCity(city);

        // Compose the SOAP response
        const soapResponse = composeSoapResponse(temperature);

        // Send the SOAP response
        res.set('Content-Type', 'text/xml');
        res.status(200).send(soapResponse);
      })
      .catch((error) => {
        console.error('Error parsing SOAP request:', error);
        // Return an error SOAP response if parsing fails
        const soapErrorResponse = composeSoapErrorResponse();
        res.set('Content-Type', 'text/xml');
        res.status(500).send(soapErrorResponse);
      });
  });
});

// Extract the city parameter from the SOAP envelope body
function extractCityFromBody(body) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(body, { explicitArray: false }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        const city = result['soapenv:Envelope']['soapenv:Body']['GetTemperature']['city'];
        resolve(city);
      }
    });
  });
}

// Fetch the temperature for the specified city (mock implementation)
function getTemperatureForCity(city) {
  // Retrieve the temperature from a weather service or database
  // Return the temperature value (mocked for example)
  return 25; // Assuming the temperature is 25 degrees Celsius
}

// Compose the SOAP response with the temperature value
function composeSoapResponse(temperature) {
  const builder = new xml2js.Builder();
  const xml = builder.buildObject({
    'soapenv:Envelope': {
      $: {
        'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
      },
      'soapenv:Body': {
        GetTemperatureResponse: {
          temperature: temperature
        }
      }
    }
  });
  return xml;
}

// Compose an error SOAP response
function composeSoapErrorResponse() {
  const builder = new xml2js.Builder();
  const xml = builder.buildObject({
    'soapenv:Envelope': {
      $: {
        'xmlns:soapenv': 'http://schemas.xmlsoap.org/soap/envelope/',
        'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance'
      },
      'soapenv:Body': {
        'soapenv:Fault': {
          faultcode: 'Server',
          faultstring: 'Error processing SOAP request'
        }
      }
    }
  });
  return xml;
}

// Create a SOAP server using the soap library and connect it with the server implementation
const soapServer = soap.listen(app, '/weather/service', {}, wsdl);

// Handle the SOAP request
soapServer.on('request', (request, methodName) => {
  console.log('Received SOAP request for method:', methodName);
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
