// @ts-ignore: Ignore k6 module resolution
import http from 'k6/http';
// @ts-ignore
import { sleep } from 'k6';

function poissonRandom(lambda: number): number {
    return -Math.log(1.0 - Math.random()) / lambda;
}

export let options = {
  stages: [
    { duration: '2m', target: 2000 }, // fast ramp-up to a high point
    // No plateau
    { duration: '1m', target: 0 }, // quick ramp-down to 0 users
  ],
};

export default function () {
    let lambda = 10;
    let interArrivalTime = poissonRandom(lambda);

    let registerPayload = JSON.stringify({
        username: `spikeuser${Math.floor(Math.random() * 10000)}`,
        email: `spike${Math.floor(Math.random() * 10000)}@example.com`,
        password: "Password123",
        full_name: "Spike User",
        address: "123 Spike Street, Spike City",
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

    sleep(interArrivalTime);
}
