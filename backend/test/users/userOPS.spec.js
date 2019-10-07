// File contains tests on different user operations

const common = require('../common');
const chai = common.chai;
const chaiHTTP = common.chaiHTTP;
const User = common.User;
const server = common.server;
const should = common.should;

chai.use(chaiHTTP);
// Required for testing dates due to there different formats
chai.use(require('chai-datetime'));

describe('User database operations', () => {

    // Our test user to use for correct info and correct login
    const userData = {
        firstName: "TesterAlpha",
        lastName: "McTester",
        publicName: "Tester",
        email: "test@gmail.com",
        confirmEmail: "test@gmail.com",
        password: "test123",
        confirmPass: "test123",
        birthDate: "2015-03-25"
    };

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
    });
});