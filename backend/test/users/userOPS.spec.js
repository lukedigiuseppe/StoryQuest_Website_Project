// File contains tests on different user operations

const common = require('../common');
const chai = common.chai;
const chaiHTTP = common.chaiHTTP;
const User = common.User;
const server = common.server;
const should = common.should;
const userData = common.userData;
// Required for decoding JWT token to check for valid info
const jwtDecode = require('jwt-decode');

chai.use(chaiHTTP);
// Required for testing dates due to there different formats
chai.use(require('chai-datetime'));

describe('User database operations', () => {

    // Clear user database before doing these tests, only once cos we want some user data to remain for subsequent tests
    before((done) => {
        User.deleteMany({} , (err) => {
            done();
        });
    });

    // Test POST registering a new user with incorrect information
    describe('/POST register new user', () => {
        it('should not register a new user without all the required information.', (done) => {
            var newUser = {
                // Missing email, confirmEmail, publicname, firstname, lastname, password, confirmPassword, birthdate. Only location is optional
                location: "Test Land"
            };

            chai.request(server)
                .post('/api/users/register')
                .send(newUser)
                .end((err, res) => {
                    should.equal(err, null);
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('firstName');
                    res.body.firstName.should.be.eql('Please enter your first name. It is required.');
                    res.body.should.have.property('lastName');
                    res.body.lastName.should.be.eql('Please enter your last name. It is required.');
                    res.body.should.have.property('publicName');
                    res.body.publicName.should.be.eql('Please enter a name that will be displayed to all users. It is required.');
                    res.body.should.have.property('email');
                    res.body.email.should.eql('Email field is required.');
                    res.body.should.have.property('confirmEmail');
                    res.body.confirmEmail.should.be.eql('Confirm email field is required.');
                    res.body.should.have.property('password');
                    res.body.password.should.be.eql('Password must be at least 6 characters.');
                    res.body.should.have.property('confirmPass');
                    res.body.confirmPass.should.be.eql('Confirm password field is required.');
                    res.body.should.have.property('birthDate');
                    res.body.birthDate.should.be.eql('Birth date is invalid.');
                    done();
                });
        });

        // Test register user POST with correct with information
        it('should register a new user when all the required information is passed.', (done) => {
            

            chai.request(server)
                .post('/api/users/register')
                .send(userData)
                .end((err, res) => {
                    should.equal(err, null);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('firstName').eql(userData.firstName);
                    res.body.should.have.property('lastName').eql(userData.lastName);
                    res.body.should.have.property('publicName').eql(userData.publicName);
                    res.body.should.have.property('email').eql(userData.email);
                    res.body.should.have.property('birthDate');
                    // Convert to both to Javascript Date Objects
                    var userDate = new Date(userData.birthDate);
                    var resDate = new Date(res.body.birthDate);
                    resDate.should.equalDate(userDate);
                    done();
                });
        });
    });
    
    // Test POST logging in with incorrect information
    describe('/POST login a user', () => {
        it('should not login a user if they have provided the wrong email', (done) => {
            var invalidUser = {
                email: "fakeuser@fake.gmail.com",
                password: "test123"
            };

            chai.request(server)
                .post('/api/users/login')
                .send(invalidUser)
                .end((err, res) => {
                    should.equal(err, null);
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    res.body.should.have.property('emailnotfound').eql("Email not found");
                    done();
                });
        })

        // Test login user with an incorrect password
        it('should not login a user if they have the wrong password', (done) => {
            var invalidUser = {
                email: "test@gmail.com",
                password: "wrong123"
            };

            chai.request(server)
                .post('/api/users/login')
                .send(invalidUser)
                .end((err, res) => {
                    should.equal(err, null);
                    res.should.have.status(401);
                    res.body.should.be.a('object');
                    res.body.should.have.property('passwordincorrect').eql('Password incorrect');
                    done();
                });
        });

        // Test login user with correct information
        it('should login a user if they have both a registered email and the correct password', (done) => {
            var correctData = {
                email: userData.email,
                password: userData.password
            };

            chai.request(server)
                .post('/api/users/login')
                .send(correctData)
                .end((err, res) => {
                    should.equal(err, null);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('success').eql(true);
                    res.body.should.have.property('token');
                    var token = jwtDecode(res.body.token);
                    token.should.have.property('id');
                    token.should.have.property('name').eql(userData.publicName);
                    token.should.have.property('email').eql(userData.email);
                    done();
                });
        });
    });

    // Test /PATCH /api/users/update
    describe('/PATCH /api/users/update', () => {
        // This is the auth token to be assigned to the header
        var authToken = null;
        // This is the max length the validator will allow
        const MAX_LEN = 50;

        // Run once before all of the tests begin
        before('log in the test user', (done) => {
            // Get the returned auth token

            var userLogin = {
                email: userData.email,
                password: userData.password
            }

            chai.request(server)
                .post('/api/users/login')
                .send(userLogin)
                .end((err, res) => {
                    authToken = res.body.token;
                    done();
                });
        });

        it("should NOT be able to update a user's details if they are not logged in", (done) => {

            const updateData = {
                firstName: "hello",
                lastName: "jacky",
                publicName: "jayqueline",
                location: "new jersey"
            }

            chai.request(server)
                .patch('/api/users/update')
                .send(updateData)
                .end((err, res) => {
                    should.equal(err, null);
                    res.should.have.status(401);
                    res.text.should.eql("Unauthorised user. Please login to update details.");
                    // Check that details are still the same
                    User.findOne({firstName: userData.firstName}, (err, user) => {
                        should.equal(err, null);
                        should.not.equal(user, null);
                        user.should.have.property("firstName").eql(userData.firstName);
                        user.should.have.property("lastName").eql(userData.lastName);
                        user.should.have.property("publicName").eql(userData.publicName);
                        user.should.have.property("location").eql(userData.location);
                        done();
                    });
                });
        });

        it("should NOT be able to update the user's details if they provide invalid information even if they are logged in", (done) => {
            
            const invalidData = {
                firstName: "a reallllllllllllllllllllllllllllllllllllllllyyyyyyyyyyyyy lllllllllllllllllllloooooooooooooooonnnnnnnnnnnnnnnnggggggggggggg naaaaaaaame",
                lastName: "a reallllllllllllllllllllllllllllllllllllllllyyyyyyyyyyyyy lllllllllllllllllllloooooooooooooooonnnnnnnnnnnnnnnnggggggggggggg naaaaaaaame",
                publicName: "a reallllllllllllllllllllllllllllllllllllllllyyyyyyyyyyyyy lllllllllllllllllllloooooooooooooooonnnnnnnnnnnnnnnnggggggggggggg naaaaaaaame",
                location: "aaaaaaaaa rrrrrrrrrreeeeeeeeeeeeeaaaaaaaaaaaallllllllllllllyyyyyyyyyyy llllllllllllloooooooooonnnnnnnnnnnnnggggggggggg lllllllooooooocccccccccaaaaaaaatttttttiiiiiooonn"
            }

            chai.request(server)
                .patch('/api/users/update')
                .set("Authorization", authToken)
                .send(invalidData)
                .end((err, res) => {
                    should.equal(err, null);
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('firstName').eql("Firstname must be between 0 and " + MAX_LEN + " characters long.");
                    res.body.should.have.property('lastName').eql("Lastname must be between 0 and " + MAX_LEN + " characters long.");
                    res.body.should.have.property('publicName').eql("Publicname must be between 0 and " + MAX_LEN + " characters long.");
                    res.body.should.have.property('location').eql("The location must be between 0 and " + MAX_LEN + " characters long.");
                    // Check that details are still the same
                    User.findOne({firstName: userData.firstName}, (err, user) => {
                        should.equal(err, null);
                        should.not.equal(user, null);
                        user.should.have.property("firstName").eql(userData.firstName);
                        user.should.have.property("lastName").eql(userData.lastName);
                        user.should.have.property("publicName").eql(userData.publicName);
                        user.should.have.property("location").eql(userData.location);
                        done();
                    });
                });
        });

        it("should UPDATE a user's details if they are logged in and provide valid information", (done) => {

            const updateData = {
                firstName: "hello",
                lastName: "jacky",
                publicName: "jayqueline",
                location: "new jersey"
            }

            chai.request(server)
                .patch('/api/users/update')
                .set("Authorization", authToken)
                .send(updateData)
                .end((err, res) => {
                    should.equal(err, null);
                    res.should.have.status(201);
                    res.text.should.eql("Profile successfully updated.");
                    // Check that the details have actually changed
                    User.findOne({firstName: updateData.firstName}, (err, user) => {
                        should.equal(err, null);
                        should.not.equal(user, null);
                        user.should.have.property("firstName").eql(updateData.firstName);
                        user.should.have.property("lastName").eql(updateData.lastName);
                        user.should.have.property("publicName").eql(updateData.publicName);
                        user.should.have.property("location").eql(updateData.location);
                        done();
                    });
                });
        });

        it("should be able to add a new user as a friend or 'known user' to a user's details if they are logged in and provide a valid email address", (done) => {
            const updateData = {
                newFriend: "friendly@gmail.com"
            }

            chai.request(server)
                .patch('/api/users/update')
                .set("Authorization", authToken)
                .send(updateData)
                .end((err, res) => {
                    should.equal(err, null);
                    res.should.have.status(201);
                    res.text.should.eql("Profile successfully updated.");
                    // Check that the details have actually changed
                    User.findOne({email: userData.email}, (err, user) => {
                        should.equal(err, null);
                        should.not.equal(user, null);
                        user.should.have.property("knownUsers");
                        user.knownUsers.should.satisfy((knownUsers) => {
                            return knownUsers.includes(updateData.newFriend);
                        });
                        done();
                    });
                })
        })
    });
});