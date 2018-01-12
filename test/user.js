let mongoose = require('mongoose');
let User = require('../api/models/userModel');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

function login(cb) {

}

describe('User', () => {
    let bearerToken;
    
    beforeEach((done) => {
        chai.request(server)
            .post('/api/users/login')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send('email=test@test.com')
            .send('password=testpassword')
            .end((req, res) => {
                bearerToken = res.body;
                done();
            });
    });

    it('GET/ should return an empty object when database is empty', (done) => {
        chai.request(server)
            .get('/api/users')
            .set('Authorization', bearerToken)
            .end((err, res) => {
                console.log(res);
                res.should.be.a('object');
              done();
            });
    });
});
    // it('GET/ should return users', (done) => {
    //     const newUser = new User({
    //         email: 'test@test.com',
    //         password: 'testpassword',
    //         profile: {
    //             firstName: 'testy',
    //             lastName: 'mctesterson',
    //         }
    //     });

    //     newUser.save((err, user) => {
    //         chai.request(server)
    //             .get('/api/users')
    //             .end((err, res) => {
    //                 res.should.be.a('object');
    //               done();
    //             });
    //     });
    // });
// });