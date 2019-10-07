const common = require('../common');
const chai = common.chai;
const chaiHTTP = common.chaiHTTP;
const Artifact = common.Artifact;
const server = common.server;
const userData = common.userData;
const should = common.should;


chai.use(chaiHTTP);

// Describe the test and what defines its success
describe('Artifact database operations', () => {
    // Our suite of tests to run

    // This is the auth token to be assigned to the header
    var authToken = null;

    // Run once before all of the tests begin
    before('log in the test user', (done) => {
        // Get the returned auth token

        var userLogin = {
            email: userData.email,
            password: userData.password
        }

        chai.request(server)
            .post('/api/users/login')
            .send(userLogin)
            .end((err, res) => {
                authToken = res.body.token;
                done();
            });
    });

    

    // Testing our get all public artifacts route when the database is completely empty
    describe('/GET artifacts', () => {

        // clear database
        before((done) => {
            Artifact.deleteMany({}, (err) => {
                done();
            });
        });

        it('it should get no artifacts back because none exist in the database', (done) => {
            chai.request(server)
                .get('/artifacts')
                .end((err, res) => {
                    // Check our expected results here
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(0);
                    done();
                });
        });
    });

    // Test POST newArtifact route
    describe('/POST newArtifact', () => {

        // Clear database
        before((done) => {
            Artifact.deleteMany({}, (err) => {
                done();
            });
        });

        // Testing adding an artifact without logging in
        it('it should not POST a new artifact without logging in', (done) => {
            var artifact = {
                name: 'Test artifact',
                story: 'This artifact is a test one'
            }
            chai.request(server)
                .post('/newArtifact')
                .send(artifact)
                .end((err, res) => {
                    res.should.have.status(401);
                    res.text.should.be.a('string');
                    res.text.should.be.eql('Unauthorised user');
                    done();
                });
        });

        // Testing adding an artifact when logged in but with incorrect information
        it('it should not POST a new artifact even if the user is logged in when the artifact information entered is incorrect', (done) => {
            // Artifact without a name should fail
            var newArtifact = {
                name: "",
                story: "Hey this is a test artifact",
                tags: "test artifact",
                category: 'vase',
                isPublic: 'private'
            };

            chai.request(server)
                .post('/newArtifact')
                .set("Authorization", authToken)
                .send(newArtifact)
                .end((err, res) => {
                    should.equal(err, null);
                    res.should.have.status(400);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name').eql('Artifact name field is required.');
                    done();
                });
        });

        // Testing adding an artifact when logged in and with correct information
        it('it should POST a new artifact when the user has logged in and entered the correct information', (done) => {
            // Artifact with all details should not fail
            var newArtifact = {
                name: "test artifact",
                story: "Hey this is a test artifact",
                tags: ["test", "artifact tags"],
                category: 'vase',
                isPublic: 'private'
            };

            chai.request(server)
                .post('/newArtifact')
                .set("Authorization", authToken)
                .send(newArtifact)
                .end((err, res) => {
                    should.equal(err, null);
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('serialNumber').not.eql('');
                    res.body.should.have.property('passcode').not.eql('');
                    res.body.should.have.property('name').eql(newArtifact.name);
                    res.body.should.have.property('story').eql(newArtifact.story);
                    res.body.should.have.property('tags').eql(newArtifact.tags.join(' '));
                    res.body.should.have.property('category').eql(newArtifact.category);
                    res.body.should.have.property('isPublic').eql(newArtifact.isPublic);
                    res.body.should.have.property('ownerID').not.eql(null);
                    done();
                });
        });
                
        after('delete test add artifact', (done) => {
            Artifact.deleteMany({}, (err) => {
                done();
            });
        });
    });

    
    // Test searching for public artifacts based on name
    describe('/POST searchartifacts', () => {

        const dummy = {
            name: "search dummy artifact",
            story: "Hey this is a test artifact",
            tags: ["test", "dummy tags"],
            category: 'vase',
            isPublic: 'public' 
        }

        before('add a dummy artifact to search', (done) => {
            chai.request(server)
                .post('/newArtifact')
                .set("Authorization", authToken)
                .send(dummy)
                .end((err, res) => {
                    done();
                });
        });

        it('should return all public artifacts in an array related to "dummy" when "dummy" is entered as the search text', (done) => {
            const searchText = {
                searchString: "dummy"
            };

            chai.request(server)
                .post('/searchartifacts')
                .send(searchText)
                .end((err, res) => {
                    should.equal(err, null);
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    for (artifact of res.body) {
                        artifact.should.have.property('ownerID').not.eql(null);
                        artifact.should.have.property('isPublic').eql('public');
                        artifact.should.have.property('name').not.eql('');
                        artifact.should.have.property('story').not.eql('');
                        artifact.should.have.property('category').not.eql('');
                    }
                    done();
                });
        });

        after('delete dummy artifact', (done) => {
            Artifact.deleteMany({}, (err) => {
                done();
            });
        });
    });
});