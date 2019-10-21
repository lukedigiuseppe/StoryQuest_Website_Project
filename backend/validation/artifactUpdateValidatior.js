// Contains the validation rules/logic for the update artifact page

const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateEditArtifact(data) {
    let errors = {};
    const MAX_LEN = 50;

    // Convert empty fields to an empty string so that we can use validator functions
    data.name = !isEmpty(data.name) ? data.name: "";
    data.story = !isEmpty(data.story) ? data.story: "";
    data.tags = !isEmpty(data.tags) ? data.tags: "";
    data.category = !isEmpty(data.category) ? data.category: "";
    data.isPublic = !isEmpty(data.isPublic) ? data.isPublic: "";
    data.dateMade = !isEmpty(data.dateMade) ? data.dateMade: "";

    // Check that the fields are valid
    if (!Validator.isEmpty(data.name)) {
        if (!Validator.isLength(data.name, 1, MAX_LEN)) {
            errors.name = "Artifact name is not valid. Must be between 1 and " + MAX_LEN + " charcters long.";
        }
    }

    if (Validator.isEmpty(data.story)) {
        errors.story = "There must be an artifact story. Don't leave it empty, please tell us about it.";
    }
    
    // Check that if date made is non-empty then make sure that it is a valid date
    if (!Validator.isEmpty(data.dateMade)) {
        if (!Validator.isBefore(data.dateMade)) {
            errors.dateMade = "The date you have entered is invalid. It cannot be a date in the future";
        }
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};