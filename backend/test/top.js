// The top level file. This is a custom test loader file to run all of our tests.

// A helper function to help load in tests

function importTest(name, path) {
    describe(name, function() {
        require(path);
    });
}

// Import read-only globals required for setup
var common = require("./common");

describe("top level", function() {
    importTest("User tests", './users/userOPS.spec.js');
    importTest("Artifact tests", './artifacts/artifactOPS.spec.js');
});

