const http = require('http');

const BASE_URL = 'http://localhost:5000/api';

const makeRequest = (method, path, body = null, token = null) => {
  return new Promise((resolve, reject) => {
    const url = new URL(`${BASE_URL}${path}`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (body) {
      const bodyData = JSON.stringify(body);
      options.headers['Content-Length'] = Buffer.byteLength(bodyData);
    }

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', (e) => reject(e));

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const runTests = async () => {
  console.log('--- STARTING API TESTS ---\n');
  let adminToken = '';
  let participantToken = '';
  let organizerToken = '';

  try {
    // 1. Auth Login - Admin
    console.log('Testing Admin Login...');
    const adminLogin = await makeRequest('POST', '/auth/login', { email: 'admin@felicity.com', password: 'Admin@123' });
    if (adminLogin.status === 200 && adminLogin.data.token) {
      console.log('✅ Admin Login Successful');
      adminToken = adminLogin.data.token;
    } else {
      console.log('❌ Admin Login Failed', adminLogin.status, adminLogin.data);
    }

    // 2. Auth Login - Organizer
    console.log('\nTesting Organizer Login...');
    const orgLogin = await makeRequest('POST', '/auth/login', { email: 'felicitycoreteam@iiit.ac.in', password: 'password123' });
    if (orgLogin.status === 200 && orgLogin.data.token) {
      console.log('✅ Organizer Login Successful');
      organizerToken = orgLogin.data.token;
    } else {
      console.log('❌ Organizer Login Failed', orgLogin.status, orgLogin.data);
    }

    // 3. Auth Login - Participant
    console.log('\nTesting Participant Login (Finding one dynamically)...');
    // First, let's just create a new participant to be safe
    const newPart = {
      firstName: 'Test',
      lastName: 'User',
      email: `test${Date.now()}@students.iiit.ac.in`,
      password: 'password123',
      participantType: 'iiit',
      contactNumber: '9999999999',
      collegeOrOrg: 'IIIT Hyderabad'
    };
    const partRegister = await makeRequest('POST', '/auth/register', newPart);
    if (partRegister.status === 201 && partRegister.data.token) {
      console.log('✅ Participant Registration Successful');
      participantToken = partRegister.data.token;
    } else {
      console.log('❌ Participant Registration Failed', partRegister.status, partRegister.data);
    }

    // 4. Public Events Listing
    console.log('\nTesting Public Events Fetch...');
    const events = await makeRequest('GET', '/events');
    if (events.status === 200 && Array.isArray(events.data)) {
      console.log(`✅ Events Fetch Successful (${events.data.length} events found)`);
    } else {
      console.log('❌ Events Fetch Failed', events.status);
    }

    // 5. Participant Profile
    console.log('\nTesting Participant Profile Fetch...');
    const profile = await makeRequest('GET', '/participants/profile', null, participantToken);
    if (profile.status === 200 && profile.data.email) {
      console.log('✅ Profile Fetch Successful');
    } else {
      console.log('❌ Profile Fetch Failed', profile.status, profile.data);
    }

    // 6. Admin Organizers Fetch
    console.log('\nTesting Admin Organizers Fetch...');
    const orgs = await makeRequest('GET', '/admin/organizers', null, adminToken);
    if (orgs.status === 200 && Array.isArray(orgs.data)) {
      console.log(`✅ Admin Organizers Fetch Successful (${orgs.data.length} organizers found)`);
    } else {
      console.log('❌ Admin Organizers Fetch Failed', orgs.status, orgs.data);
    }

    // 7. Organizer My Events Fetch
    console.log('\nTesting Organizer Dashboard Fetch...');
    const myEvents = await makeRequest('GET', '/events/organizer/my-events', null, organizerToken);
    if (myEvents.status === 200 && Array.isArray(myEvents.data)) {
      console.log(`✅ Organizer Events Fetch Successful (${myEvents.data.length} events found)`);
    } else {
      console.log('❌ Organizer Events Fetch Failed', myEvents.status, myEvents.data);
    }

    console.log('\n--- API TESTS COMPLETED ---');
  } catch (error) {
    console.error('Test execution failed:', error.message);
  }
};

runTests();
