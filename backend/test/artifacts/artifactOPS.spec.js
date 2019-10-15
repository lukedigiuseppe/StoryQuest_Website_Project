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

    describe('/GET no public artifacts', () => {

        before('clear the database', (done) => {
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

    // Testing our get all public artifacts route when the database is filled with public artifacts and one private artifact
    describe('/GET all public artifacts', () => {

        const publicDummy = {
            name: "search public dummy artifact",
            story: "Hey this is a test artifact",
            tags: ["test", "dummy tags"],
            category: 'vase',
            isPublic: 'public' 
        }

        const privateDummy = {
            name: "search private dummy artifact",
            story: "Hey this is a private artifact",
            tags: ['test', 'private', 'test artifact'],
            category: 'vase',
            isPublic: 'private'
        }

        before('add one private dummy artifact to database', (done) => {
            chai.request(server)
                .post('/newArtifact')
                .set("Authorization", authToken)
                .send(privateDummy)
                .end((err, res) => {
                    done();
                });
        });

        const AMOUNT = 3;

        before('add ' + AMOUNT + ' public dummy artifacts to database', (done) => {
            var counter = 0;
            for (var i = 0; i < 3; i++) {
                chai.request(server)
                    .post('/newArtifact')
                    .set("Authorization", authToken)
                    .send(publicDummy)
                    .end((err, res) => {
                        counter++;
                        if (counter === AMOUNT) {
                            done();
                        } 
                    });
            }
        });

        it('it should get all public artifacts back if any exist in the database', (done) => {
            chai.request(server)
                .get('/artifacts')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(AMOUNT);
                    for (artifact of res.body) {
                        artifact.isPublic.should.eql('public');
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

        const publicDummy = {
            name: "search public dummy artifact",
            story: "Hey this is a test artifact",
            tags: ["test", "dummy tags"],
            category: 'vase',
            isPublic: 'public' 
        }

        const privateDummy = {
            name: "search private dummy artifact",
            story: "Hey this is a private artifact",
            tags: ['test', 'private', 'test artifact'],
            category: 'vase',
            isPublic: 'private'
        }

        const friendDummy = {
            name: "search friend dummy artifact",
            story: "hey this a friend's artifact",
            tags: ['test', 'friend', 'test artifact'],
            category: 'vase',
            isPublic: 'friends'
        }

        before('add a public dummy artifact to search', (done) => {
            chai.request(server)
                .post('/newArtifact')
                .set("Authorization", authToken)
                .send(publicDummy)
                .end((err, res) => {
                    done();
                });
        });

        before('add a private dummy artifact', (done) => {
            chai.request(server)
                .post('/newArtifact')
                .set("Authorization", authToken)
                .send(privateDummy)
                .end((err, res) => {
                    done();
                });
        });

        before('add a friends dummy artifact', (done) => {
            chai.request(server)
                .post('/newArtifact')
                .set("Authorization", authToken)
                .send(friendDummy)
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

        it('should return all public and private artifacts in an array related to "dummy" when "dummy" is entered as search text and there are both public and private artifacts', (done) => {
            const searchText = {
                searchString: "dummy"
            }

            chai.request(server)
                .post('/searchartifacts')
                .send(searchText)
                .end((err, res) => {
                    should.equal(err, null);
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    for (artifact of res.body) {
                        artifact.should.have.property('ownerID').not.eql(null);
                        artifact.should.have.property('isPublic');
                        artifact.isPublic.should.satisfy( (isPublic) => {
                            return (isPublic === 'public') || (isPublic === "private");
                        });
                        artifact.should.have.property('name').not.eql('');
                        artifact.should.have.property('story').not.eql('');
                        artifact.should.have.property('category').not.eql('');
                    }
                    done();
                })
        });

        it('should only return all public, friends and private artifacts in an array related to "dummy" when "dummy" is entered as search text and there are both public, friends and private artifacts when the user is NOT LOGGED IN', 
        (done) => {
            const searchText = {
                searchString: "dummy"
            }

            chai.request(server)
                .post('/searchartifacts')
                .send(searchText)
                .end((err, res) => {
                    should.equal(err, null);
                    res.body.should.be.a('array');
                    res.should.have.status(200);
                    res.body.length.should.be.eql(1);
                    for (artifact of res.body) {
                        artifact.should.have.property('ownerID').not.eql(null);
                        artifact.should.have.property('isPublic');
                        artifact.isPublic.should.satisfy( (isPublic) => {
                            return (isPublic === 'public') || (isPublic === "private") || (isPublic === 'friends');
                        });
                        artifact.should.have.property('name').not.eql('');
                        artifact.should.have.property('story').not.eql('');
                        artifact.should.have.property('category').not.eql('');
                    }
                    done();
                })
        });

        it('should only return all public, friends and private artifacts in an array related to "dummy" when "dummy" is entered as search text and there are both public, friends and private artifacts when the user is LOGGED IN', 
        (done) => {
            const searchText = {
                searchString: "dummy"
            }

            chai.request(server)
                .post('/searchartifacts')
                .set("Authorization", authToken)
                .send(searchText)
                .end((err, res) => {
                    should.equal(err, null);
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(3);
                    for (artifact of res.body) {
                        artifact.should.have.property('ownerID').not.eql(null);
                        artifact.should.have.property('isPublic');
                        artifact.isPublic.should.satisfy( (isPublic) => {
                            return (isPublic === 'public') || (isPublic === "private") || (isPublic === 'friends');
                        });
                        artifact.should.have.property('name').not.eql('');
                        artifact.should.have.property('story').not.eql('');
                        artifact.should.have.property('category').not.eql('');
                    }
                    done();
                })
        });

        after('delete dummy artifact', (done) => {
            Artifact.deleteMany({}, (err) => {
                done();
            });
        });
    });

    // Test /GET artifact/:artifactid
    describe('/GET /artifact/:artifactid route', () => {

        // Add in some dummy artifacts for each privacy level and store the corresponding artifact IDs

        var publicID = null;
        var friendID = null;
        var privateID = null;

        const publicDummy = {
            name: "search public dummy artifact",
            story: "Hey this is a test artifact",
            tags: ["test", "dummy tags"],
            category: 'vase',
            isPublic: 'public' 
        }

        const privateDummy = {
            name: "search private dummy artifact",
            story: "Hey this is a private artifact",
            tags: ['test', 'private', 'test artifact'],
            category: 'vase',
            isPublic: 'private'
        }

        const friendDummy = {
            name: "search friend dummy artifact",
            story: "hey this a friend's artifact",
            tags: ['test', 'friend', 'test artifact'],
            category: 'vase',
            isPublic: 'friends'
        }

        before('add a public dummy artifact to search', (done) => {
            chai.request(server)
                .post('/newArtifact')
                .set("Authorization", authToken)
                .send(publicDummy)
                .end((err, res) => {
                    publicID = res.body._id;
                    done();
                });
        });

        before('add a private dummy artifact', (done) => {
            chai.request(server)
                .post('/newArtifact')
                .set("Authorization", authToken)
                .send(privateDummy)
                .end((err, res) => {
                    privateID = res.body._id;
                    done();
                });
        });

        before('add a friends dummy artifact', (done) => {
            chai.request(server)
                .post('/newArtifact')
                .set("Authorization", authToken)
                .send(friendDummy)
                .end((err, res) => {
                    friendID = res.body._id;
                    done();
                });
        });

        it('should return the artifact data for a PUBLIC artifact even if the user is not logged in', (done) => {
            chai.request(server)
                .get('/artifact/' + publicID)
                .end((err, res) => {
                    should.equal(err, null);
                    res.should.have.status(200);
                    res.body.should.be.a('object')
                    res.body.should.have.property('name').eql(publicDummy.name);
                    res.body.should.have.property('story').eql(publicDummy.story);
                    res.body.should.have.property('tags').eql(publicDummy.tags.join(' '));
                    res.body.should.have.property('category').eql(publicDummy.category);
                    done();
                });
        });

        it('should NOT return the artifact data for a PRIVATE artifact if the user is not logged in', (done) => {
            chai.request(server)
                .get('/artifact/' + privateID)
                .end((err, res) => {
                    should.equal(err, null);
                    res.should.have.status(401);
                    res.text.should.be.a('string');
                    res.text.should.be.eql('Unauthorised user. You are not allowed to view this resource.');
                    done();
                });
        });

        it('should return the artifact data for a PRIVATE artifact if the user who has created it is logged in', (done) => {
            chai.request(server)
                .get('/artifact/' + privateID)
                .set("Authorization", authToken)
                .end((err, res) => {
                    should.equal(err, null);
                    res.should.have.status(200);
                    res.body.should.be.a('object')
                    res.body.should.have.property('name').eql(privateDummy.name);
                    res.body.should.have.property('story').eql(privateDummy.story);
                    res.body.should.have.property('tags').eql(privateDummy.tags.join(' '));
                    res.body.should.have.property('category').eql(privateDummy.category);
                    done();
                });
        });

        it('should return the artifact data for a FRIEND artifact if the user who has created it is logged in', (done) => {
            chai.request(server)
                .get('/artifact/' + friendID)
                .set("Authorization", authToken)
                .end((err, res) => {
                    should.equal(err, null);
                    res.should.have.status(200);
                    res.body.should.be.a('object')
                    res.body.should.have.property('name').eql(friendDummy.name);
                    res.body.should.have.property('story').eql(friendDummy.story);
                    res.body.should.have.property('tags').eql(friendDummy.tags.join(' '));
                    res.body.should.have.property('category').eql(friendDummy.category);
                    done();
                });
        });

        after('delete dummy artifact', (done) => {
            Artifact.deleteMany({}, (err) => {
                done();
            });
        });

    });
    
    // Test /DELETE /delete_artifact/:artifactID
    describe('/DELETE /delete_artifact/:artifactID route', () => {

        var artifactID = null;

        const dummy = {
            name: "search public dummy artifact",
            story: "Hey this is a test artifact",
            tags: ["test", "dummy tags"],
            category: 'vase',
            isPublic: 'public' 
        }

        before('add a dummy artifact to delete', (done) => {
            chai.request(server)
                .post('/newArtifact')
                .set("Authorization", authToken)
                .send(dummy)
                .end((err, res) => {
                    artifactID = res.body._id;
                    done();
                });
        });

        it('should NOT delete the artifact if there is no user logged in', (done) => {
            chai.request(server)
                .delete('/delete_artifact/' + artifactID)
                .end((err, res) => {
                    should.equal(err, null);
                    res.should.have.status(401);
                    res.text.should.eql("Unauthorised user, you are not the owner of this artifact.");
                    done();
                }); 
        });

        it('should DELETE the artifact if the owner of it is logged in', (done) => {
            chai.request(server)
                .delete('/delete_artifact/' + artifactID)
                .set("Authorization", authToken)
                .end((err, res) => {
                    should.equal(err, null);
                    res.should.have.status(200);
                    res.text.should.eql("Delete successful.");
                    Artifact.find({}, (err, artifacts) => {
                        should.equal(err, null);
                        artifacts.length.should.eql(0);
                        done();
                    });
                });
        });

        after('clean artifact collection', (done) => {
            Artifact.deleteMany({}, (err) => {
                done();
            });
        });
    });
});