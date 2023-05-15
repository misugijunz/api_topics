const axios = require('axios');
const xml2js = require('xml2js');

// Define the SOAP request body
const requestBody = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:exa="http://example.com/weather">
    <soapenv:Header/>
    <soapenv:Body>
      <exa:GetTemperature>
        <exa:city>New York</exa:city>
      </exa:GetTemperature>
    </soapenv:Body>
  </soapenv:Envelope>
`;

// Set the SOAP endpoint URL
const soapEndpoint = 'http://example.com/weather/service';

// Make the SOAP request
axios
  .post(soapEndpoint, requestBody, {
    headers: {
      'Content-Type': 'text/xml',
    },
  })
  .then((response) => {
    // Extract the temperature from the SOAP response
    const soapResponse = response.data;
    extractTemperatureFromResponse(soapResponse)
      .then((temperature) => {
        console.log('Temperature:', temperature);
      })
      .catch((error) => {
        console.error('Error extracting temperature:', error);
      });
  })
  .catch((error) => {
    console.error('Error making SOAP request:', error);
  });

// Extract the temperature from the SOAP response
function extractTemperatureFromResponse(soapResponse) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(soapResponse, { explicitArray: false }, (error, result) => {
      if (error) {
        reject(error);
      } else {
        const temperature = result['soapenv:Envelope']['soapenv:Body']['GetTemperatureResponse']['temperature'];
        resolve(temperature);
      }
    });
  });
}
