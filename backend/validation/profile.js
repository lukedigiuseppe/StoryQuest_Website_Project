// Contains the validation rules/logic for the update profile form

const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateUpdateProfile(data) {
    let errors = {};

    // Convert empty fields to an empty string so that we can use validator functions
    data.firstName = !isEmpty(data.firstName) ? data.firstName: "";
    data.lastName = !isEmpty(data.lastName) ? data.lastName: "";
    data.publicName = !isEmpty(data.publicName) ? data.publicName: "";
    data.newFriend = !isEmpty(data.newFriend) ? data.newFriend: "";
    data.location = !isEmpty(data.location) ? data.location: "";

    // All above fields can be empty but can be no longer than 50 characters each
    const MAX_LEN = 50;
    if (!Validator.isLength(data.firstName,  0, MAX_LEN)) {
        errors.firstName = "Firstname must be between 0 and " + MAX_LEN + " characters long.";
    }
    if (!Validator.isLength(data.lastName,  0, MAX_LEN)) {
        errors.lastName = "Lastname must be between 0 and " + MAX_LEN + " characters long.";
    }
    if (!Validator.isLength(data.publicName,  0, MAX_LEN)) {
        errors.publicName = "Publicname must be between 0 and " + MAX_LEN + " characters long.";
    }
    if (!Validator.isLength(data.newFriend,  0, MAX_LEN)) {
        errors.newFriend = "The email must be between 0 and " + MAX_LEN + " characters long.";
    }
    if (!Validator.isLength(data.location,  0, MAX_LEN)) {
        errors.location = "The location must be between 0 and " + MAX_LEN + " characters long.";
    }

    // Friend email checks
    // We will let empty emails pass which means they don't want to add anyone
    if (!isEmpty(data.newFriend)) {
        if (!Validator.isEmail(data.newFriend)) {
            errors.newFriend = "Please enter a valid email address.";
        }
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};