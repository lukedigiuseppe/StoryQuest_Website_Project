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

exports.Artifact = Artifact;
exports.User = User;
exports.chai = chai;
exports.chaiHTTP = chaiHTTP;
exports.server = server;
exports.should = should;