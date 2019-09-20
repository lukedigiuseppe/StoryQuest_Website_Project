// This file contains the routes that the server backend will provide regarding all user actions

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Load the input validator
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load up the User module
const User = require("../../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
    // Form validation
    const {errors, isValid} = validateRegisterInput(req.body);
    // Check the validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // Find the user by email
    User.findOne({ email: req.body.email }).then( user => {
        if (user) {
            return(res.status(400).json({email: "Email already exists."}));
        } else {
            const newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                publicName: req.body.publicName,
                email: req.body.email,
                password: req.body.password,
                birthDate: req.body.birthDate
            });

            newUser
                .save()
                .then(user => res.json(user))
                .catch(err => console.log(err));
        }
    });
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public
router.post("/login", (req, res) => {
    // Form validation for login
    const { errors, isValid } = validateLoginInput(req.body);
    
    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find the user by the email they have given
    User.findOne({ email }).then(user => {
        // Check if user exists
        if (!user) {
            return res.status(404).json({emailnotfound: "Email not found"});
        }

        // If user exists, check their password next
        const isMatch = user.isValidPassword(password);
        if (isMatch) {
            // User is matched so create the JWT payload
            const fullName = user.firstName + " " + user.lastName;
            const payload = {
                id: user.id,
                name: fullName
            };

            // Now sign the token with the secret and user info
            jwt.sign(
                payload,
                keys.secretOrKey,
                {
                    expiresIn: 31556926 //1 year in seconds or can change to 1 hour seconds. Up to you
                },
                (err, token) => {
                    res.json({
                        success: true,
                        token: "Bearer " + token
                    });
                }
            );
        } else {
            // No password match
            return res
                .status(400)
                .json({ passwordincorrect: "Password incorrect" });
        }
    });
});

module.exports = router;