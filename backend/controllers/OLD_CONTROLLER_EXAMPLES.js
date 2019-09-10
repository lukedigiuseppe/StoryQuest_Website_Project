/* This controller contains all basic functions
 * as well as user-related functions
 */
require('../models/users');


//require the data
var mongoose = require('mongoose');
var User = mongoose.model('users');
const request = require('request');
const UNDEFINED = 'Not Found';

var passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;


//require nodemailer to send verification emails
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: 'INSERT EMAIL',
        pass: 'PASSPORT'
    }
});

// Render the homepage
var index = function(req,res){
    res.render('index.pug');
};

var homepage = function(req,res){
    //console.log(req.user.id);
    res.render('homepage.pug',{user:req.user});
};


//define callbacks
/*
var login = function(req,res){
    const groupInfo = "Group information : \n"+
        "Group Name: Scorpion Dev Co. \n"+
        "Members: Judith Chhoeur, Inderpreet Singh, Silan Li, Baitong Chen\n";
    res.send(groupInfo);
};

*/

var logout = function(req, res) {
    req.logout();
    res.render('logout.pug');
};

//VIEW login page
var login = function(req,res){
    res.render('login.pug');

};
var loginFlash = function(req,res){
    res.render('loginFlash.pug');

};

// login method  with passport authenticate
var authenticate = function(req, res, next){
    passport.authenticate('local', {
        successRedirect: '/homepage',
        failureRedirect: '/UnverifiedUser',
    })(req, res, next);
};

/// Configure the local strategy for use by Passport.
//
// (1) Input: Username & Password submitted via user
// (2) Verify that the username and password combination by accessing Unimelb student database API
// (3) IF Verified check if that user exists on the local DB. If they don't copy over user and profile info
//     invoke `cb` with a user object, which will be set at `req.user` in route handlers after authentication.
// (4) IF not verified redirect to /UnverifiedUser
//
module.exports = function(passport) {
    passport.use(new LocalStrategy({
            username: 'username',
            password: 'password'
        },
        function(username, password, done) {
            //console.log(username);
            // console.log(password);
            // Request from Unimelb studentdb API to verify username and password
            request(APIURL + "/username/" + username + "/password/" + password, {json: true}, (err, res, body) => {
                console.log("enters request");
                if (err) {
                    return done(err);
                }
                // User is not verified on Unimelb studentDB
                if (body == UNDEFINED) {
                    return done(null, false, { message: 'User is not a verified student at Unimelb.'});
                }
                // Copy over user info
                User.findOne({unimelbID: body}, function (err, user) {

                    // Student doesnt exists on local DB, copy over user and profile info
                    if (user == null) {
                        copyUserInfo(body._id, done);
                    }else{
                        return done(null,user);
                    }
                });
            });
        }
    ));
    // Passport serialize users into and deserialize users out of the session
    // to restore authentication across HTTP requests
    passport.serializeUser(function(user, callback) {
        callback(null, user.id);
    });
    passport.deserializeUser(function(id, callback) {

        User.findById(id, function (err, user) {
            if (err) { return cb(err); }
            callback(null, user);
        });
    });
};

// Routerware to ensure users are logged in at specific pages
var isAuthenticated =  function (req,res,next) {
    if (req.isAuthenticated()){
        return next();
    }
    return res.redirect('/loginRequired');

};

var loginRequired = function(req,res){
    res.render('loginRequired.pug');
};

// Find all users

var findAllUsers = function(req,res){
    User.find(function(err,users){
        if(!err){
            res.send(users);
        }else{
            res.sendStatus(404);
        }
    });
};

// View personal profile

var viewProfile = function(req,res){
    console.log(req.user.picture);
    res.render('profile.pug',{user:req.user, profileUser:req.user});
};


var viewOtherProfile = function(req,res){
    User.findById(req.params.userId, function(err,profileUser){
        res.render('profile.pug',{user:req.user,profileUser:profileUser});
    });
};


// Delete User
var deleteUser = function (req,res){
    User.findOneAndDelete({_id: req.params.id}, function(err){
        if(!err){
            res.send('user has been deleted');
        }else{
            res.sendStatus(400);
        }
    });
};

//HELPER FUNCTIONS

function copyUserInfo(id, done){

    request(APIURL + "/id" + "/"+ id, {json: true}, (err, res, body,next) => {
        if (err) {
            return console.log(err);
        }

        var newUser = new User({
            "username": body.userName,
            "unimelbID": body._id,
            "preferredName": body.preferredName,
            "lastName": body.lastName,
            "gender": body.gender,
            "age": body.age,
            "faculty": body.faculty,
            "level": body.level,
            "studentEmail":body.studentEmail,
            "picture":body.picture

        });

        newUser.save(function (err, newUser) {
            if (err) {
                res.sendStatus(400);
            }

        });

        return done(null, newUser);
    });
    console.log("User and Profile imported");
};



module.exports.index = index;
module.exports.login = login;
module.exports.logout = logout;
module.exports.homepage = homepage;
module.exports.loginRequired = loginRequired;
module.exports.authenticate = authenticate;
module.exports.loginFlash = loginFlash;
module.exports.isAuthenticated = isAuthenticated;
module.exports.findAllUsers = findAllUsers;
module.exports.viewProfile = viewProfile;
module.exports.viewOtherProfile = viewOtherProfile;
module.exports.deleteUser = deleteUser;
