let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');

function login(cb) {
    chai.request(server)
    .post('/api/users/login')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send('email=test@test.com')
    .send('password=testpassword')
    .end((req, res) => {
        bearerToken = res.body;
        cb(bearerToken);
    });
}

module.exports = login;