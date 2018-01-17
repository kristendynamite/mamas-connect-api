// TODO: needs more test conditions for various endpoints



let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();
const login = require('../utilities/test');
chai.use(chaiHttp);


// BOILERPLATE TO CREATE A NEW USER FOR TESTING
// let mongoose = require('mongoose');
// let User = require('../api/models/userModel');
// const newUser = new User({
//     email: 'test@test.com',
//     password: 'testpassword',
//     profile: {
//         firstName: 'testy',
//         lastName: 'mctesterson',
//     }
// });

// newUser.save((err, user) => {
//     chai.request(server)
//         .get('/api/users')
//         .end((err, res) => {
//             res.should.be.a('object');
//           done();
//         });
// });




describe('User', () => {
    let authObj;
    
    beforeEach((done) => {
        login((token) => {
            authObj = token;
            done();
        });
    });

    it('GET/ should return an array of users', (done) => {
        chai.request(server)
            .get('/api/users')
            .set('Authorization', authObj.token)
            .end((err, res) => {
                res.body.items.should.be.a('array');
                res.body.items[0].should.be.a('object');
                done();
            });
    });
    
    it('GET/me should return the users profile', (done) => {
        chai.request(server)
            .get('/api/users/me')
            .set('Authorization', authObj.token)
            .end((err, res) => {
                res.body.email.should.be.eql(authObj.user.email);
                done();
            });
    });

    it('GET/:id should return a user by id', (done) => {
        chai.request(server)
            .get('/api/users/' + authObj.user._id)
            .set('Authorization', authObj.token)
            .end((err, res) => {
                res.body._id.should.be.eql(authObj.user._id);
                done();
            });
    });

    let testUser;

    it('POST/register should create a user', (done) => {
        chai.request(server)
            .post('/api/users/register')
            .set('content-type', 'application/x-www-form-urlencoded')
            .send('email=user@todelete.com')
            .send('password=deleteme')
            .send('firstName=delete')
            .send('lastName=me')
            .end((err, res) => {
                testUser = res.body.user._id;
                res.body.hasOwnProperty('token').should.be.eql(true);
                done();
            });
    });

    it('PUT/:id should update a user by id', (done) => {
        const update = {
            email: 'updated@user.com'
        }

        chai.request(server)
            .put('/api/users/' + testUser)
            .set('Authorization', authObj.token)
            .send(update)
            .end((err, res) => {
                res.body.email.should.eql(update.email);
                done();
            });
    });

    it('PUT/update_role/:id should update a users role', (done) => {
        const update = {
            role: 'Admin'
        }

        chai.request(server)
            .put('/api/users/update_role/' + testUser)
            .set('Authorization', authObj.token)
            .send(update)
            .end((err, res) => {
                res.body.role.should.eql(update.role);
                done();
            });
    });

    it('PUT/update_password/:id should update a users password', (done) => {
        const update = {
            oldPassword: 'deleteme',
            newPassword: 'newpassword',
            id: testUser
        }

        chai.request(server)
            .put('/api/users/update_password/' + testUser)
            .set('Authorization', authObj.token)
            .send(update)
            .end((err, res) => {
                res.status.should.eql(200);
                done();
            });
    });

    it('DELETE/:id should delete a user by id', (done) => {
        chai.request(server)
            .delete('/api/users/' + testUser)
            .set('Authorization', authObj.token)
            .end((err, res) => {
                chai.request(server)
                    .get('/api/users/' + testUser)
                    .set('Authorization', authObj.token)
                    .end((err, res) => {
                        should.not.exist(res.body);
                        done();
                    });
            });
    });

    // TODO: write tests for this, assume its working for now as the rest of the tests are running
    // it('POST/login should log a user in', (done) => {

    // });


});