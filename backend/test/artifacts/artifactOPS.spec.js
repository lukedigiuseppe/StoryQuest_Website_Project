const common = require('../common');
const chai = common.chai;
const chaiHTTP = common.chaiHTTP;
const Artifact = common.Artifact;
const server = common.server;


chai.use(chaiHTTP);

// Describe the test and what defines its success
describe('Artifact database operations', () => {
    // Our suite of tests to run

    // The routine to run before each test. (Emptying the database here)
    beforeEach((done) => {
        Artifact.deleteMany({}, (err) => {
            done();
        });
    });

    // Testing our get all public artifacts route when the database is completely empty
    describe('/GET artifacts', () => {
        it('it should get all public artifacts', (done) => {
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
        // Testing adding an artifact without logging in
        it('it should not POST a new artifact without logging in', (done) => {
            let artifact = {
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

        // Testing adding an artifact correctly

    });
});