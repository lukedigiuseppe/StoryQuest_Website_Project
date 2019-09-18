// Validation rules for registration form

const Validator = require("validator");
const isEmpty = require("is-empty");


module.exports = function validateRegisterInput(data) {
    let errors = {};

    // Convert the empty field into empty strings to be run with the validator functions
    data.firstName = !isEmpty(data.firstName) ? data.firstName : "";
    data.lastName = !isEmpty(data.lastName) ? data.lastName : "";
    data.publicName = !isEmpty(data.publicName) ? data.publicName : "";
    data.email = !isEmpty(data.email) ? data.email: "";
    data.confirmEmail = !isEmpty(data.confirmEmail) ? data.confirmEmail: "";
    data.password = !isEmpty(data.password) ? data.password: "";
    data.confirmPass = !isEmpty(data.confirmPass) ? data.confirmPass: "";
    data.birthDate = !isEmpty(data.birthDate) ? data.birthDate : "";

    // Name checks
    if (Validator.isEmpty(data.firstName)) {
        errors.firstName = "Please enter your first name. It is required.";
    }
    if (Validator.isEmpty(data.lastName)) {
        errors.lastName = "Please enter your last name. It is required.";
    }

    if (Validator.isEmpty(data.publicName)) {
        errors.publicName = "Please enter a name that will be displayed to all users. It is required."
    }

    // Email checks
    if (Validator.isEmpty(data.email)) {
        errors.email = "Email field is required.";
    } else if (!Validator.isEmail(data.email)) {
        errors.email = "Email is invalid."
    }
    if (Validator.isEmpty(data.confirmEmail)) {
        errors.confirmEmail = "Confirm email field is required.";
    }
    if (!Validator.equals(data.email, data.confirmEmail)) {
        errors.confirmEmail = "Emails must match.";
    }

    // Password checks
    if (Validator.isEmpty(data.password)) {
        errors.password = "Password field is required.";
    }

    if (Validator.isEmpty(data.confirmPass)) {
        errors.confirmPass = "Confirm password field is required.";
    }

    if (!Validator.isLength(data.password, {min: 6, max: 30})) {
        errors.password = "Password must be at least 6 characters.";
    }

    if (!Validator.equals(data.password, data.confirmPass)) {
        errors.confirmPass = "Passwords must match.";
    }

    // Birthdate checks
    if (Validator.isEmpty(data.birthDate)) {
        errors.birthDate = "Birth date field is required.";
    }
    // Check that the birthdate is at the very least before the current day. Default for this function
    if (!Validator.isBefore(data.birthDate)) {
        errors.birthDate = "Birth date is invalid.";
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};