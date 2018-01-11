let mongoose = require('mongoose');
let User = require('../api/models/userModel');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('User', () => {
    beforeEach((done) => {
        User.remove({}, (err) => { 
            done();         
         }); 
    });

    it('GET/ should return an empty object when database is empty', (done) => {
        chai.request(server)
            .get('/api/users')
            .end((err, res) => {
                res.should.be.a('object');
              done();
            });
    });

    it('GET/ should return users', (done) => {
        const newUser = new User({
            email: 'test@test.com',
            password: 'testpassword',
            profile: {
                firstName: 'testy',
                lastName: 'mctesterson',
            }
        });

        newUser.save((err, user) => {
            chai.request(server)
                .get('/api/users')
                .end((err, res) => {
                    res.should.be.a('object');
                  done();
                });
        });
    });
});