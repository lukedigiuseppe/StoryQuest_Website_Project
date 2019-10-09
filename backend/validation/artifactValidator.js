// Contains the validation rules/logic for the add artifact page

const Validator = require("validator");
const isEmpty = require("is-empty");

module.exports = function validateAddArtifact(data) {
    let errors = {};
    const MAX_LEN = 50;

    // Convert empty fields to an empty string so that we can use validator functions
    data.name = !isEmpty(data.name) ? data.name: "";
    data.story = !isEmpty(data.story) ? data.story: "";
    data.tags = !isEmpty(data.tags) ? data.tags: "";
    data.category = !isEmpty(data.category) ? data.category: "";
    data.isPublic = !isEmpty(data.isPublic) ? data.isPublic: "";
    data.dateMade = !isEmpty(data.dateMade) ? data.dateMade: "";

    // Check that the compulsory fields are not empty
    if (Validator.isEmpty(data.name)) {
        errors.name = "Artifact name field is required.";
    } else if (!Validator.isLength(data.name, 1, MAX_LEN)) {
        errors.name = "Artifact name is too long. Must be between 1 and " + MAX_LEN + " charcters long.";
    }
    if (Validator.isEmpty(data.story)) {
        errors.story = "Story field is required.";
    }
    // Check if tag array is empty
    if (data.tags.length === 0) {
        errors.tag = "Tags field is required.";
    }
    if (Validator.isEmpty(data.category)) {
        errors.category = "A category is required.";
    }
    if (Validator.isEmpty(data.isPublic)) {
        errors.isPublic = "A privacy setting must be entered."
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