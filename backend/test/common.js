// Common file that has all of our global required variables and imports

// Set to Node environment variable to "test" when running tests
process.env.NODE_ENV = 'test';

const Artifact = require('../models/Artifact');
const User = require('../models/User');

// require our dev-dependencies for testing
const chai = require("chai");
const chaiHTTP = require('chai-http');
const server = require('../server');
const should = chai.should();

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

exports.Artifact = Artifact;
exports.User = User;
exports.chai = chai;
exports.chaiHTTP = chaiHTTP;
exports.server = server;
exports.should = should;
exports.userData = userData;