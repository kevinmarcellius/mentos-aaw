// @ts-ignore: Ignore k6 module resolution
import http from 'k6/http';
// @ts-ignore
import { sleep } from 'k6';

// Function to generate Poisson-distributed request intervals
function poissonRandom(lambda: number): number {
    return -Math.log(1.0 - Math.random()) / lambda;
}

export let options = {
    stages: [
      { duration: '3m', target: 75 }, // traffic ramp-up from 1 to a higher 75 users over 3 minutes.
      { duration: '10m', target: 75 }, // stay at higher 100 users for 10 minutes
      { duration: '2m', target: 0 }, // ramp-down to 0 users
    ],
  };

export default function () {
    let lambda = 3;  // Avg requests per second
    let interArrivalTime = poissonRandom(lambda);

    let registerPayload = JSON.stringify({
        username: `testuser${Math.floor(Math.random() * 10000)}`,
        email: `test${Math.floor(Math.random() * 10000)}@example.com`,
        password: "Password123",
        full_name: "Test User",
        address: "123 Test Street, Test City",
        phone_number: "1234567890"
    });

    let loginPayload = JSON.stringify({
        username: "testuser",
        password: "Password123"
    });

    let params = { headers: { "Content-Type": "application/json" } };

    let urls = [
        { url: 'http://18.215.153.243:30080/api/auth/v2/register', method: 'POST', body: registerPayload },
        { url: 'http://18.215.153.243:30080/api/auth/v2/login', method: 'POST', body: loginPayload }
    ];

    let request = urls[Math.floor(Math.random() * urls.length)];

    let res;
    if (request.method === 'POST') {
        res = http.post(request.url, request.body, params);
    }

    sleep(interArrivalTime);  // Wait based on Poisson delay
}
