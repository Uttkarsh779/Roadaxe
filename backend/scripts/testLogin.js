const axios = require('axios');
const API_URL = 'http://localhost:5000';

async function testLogin() {
  const users = [
    { email: 'admin@roadx.in', password: 'Admin@123' },
    { email: 'dealer@roadx.in', password: 'Dealer@123' },
    { email: 'user@roadx.in', password: 'User@123' }
  ];

  for (const u of users) {
    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, u);
      console.log(`Login SUCCESS for ${u.email}: Token received -> ${res.data.token ? 'YES' : 'NO'}`);
    } catch (err) {
      console.error(`Login FAILED for ${u.email}:`, err.response ? err.response.data.message || err.response.data : err.message);
    }
  }
}

testLogin();
