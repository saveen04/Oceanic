const fetch = require('node-fetch');

async function testApi() {
  try {
    const response = await fetch('http://localhost:3000/api/weather/sst-csv');
    const data = await response.json();
    
    if (data.success) {
      console.log('API Success!');
      console.log('Data count:', data.data.length);
      console.log('First 3 entries:', data.data.slice(0, 3));
    } else {
      console.error('API Error:', data.error);
    }
  } catch (err) {
    console.error('Connection failed (is the dev server running?):', err.message);
  }
}

testApi();
