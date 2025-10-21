const axios = require("axios");

const URL = "http://localhost:5000/s/getprofile"; // Your endpoint
const TOTAL_REQUESTS = 70; // Try more than your limit (60)
const DELAY_MS = 100; // 0.1 second between requests

async function testRateLimiter() {
  for (let i = 1; i <= TOTAL_REQUESTS; i++) {
    try {
      const res = await axios.get(URL);
      console.log(`${i}: ${res.status} - ${res.data}`);
    } catch (err) {
      if (err.response) {
        console.log(`${i}: ${err.response.status} - ${err.response.data}`);
      } else {
        console.log(`${i}: Error - ${err.message}`);
      }
    }
    await new Promise((r) => setTimeout(r, DELAY_MS));
  }
}

testRateLimiter();
