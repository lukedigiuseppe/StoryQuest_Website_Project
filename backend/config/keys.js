module.exports = {
    // Currently set to Edmond's MongoDB Atlas Cloud database
    mongoURI: "mongodb://pane:yoyo1029@appdb-shard-00-00-nuhsu.gcp.mongodb.net:27017,appdb-shard-00-01-nuhsu.gcp.mongodb.net:27017,appdb-shard-00-02-nuhsu.gcp.mongodb.net:27017/test?ssl=true&replicaSet=AppDB-shard-0&authSource=admin&retryWrites=true&w=majority",
    // This is the secret string used to sign JWT tokens. Must keep this secret at all costs.
    secretOrKey: "STORYQUESTROCKS",
    // Name to call the db if it hasn't been created
    dbName: "storyquest",
    testMongoURI: "mongodb://pane:yoyo1029@test-database-shard-00-00-fhbyf.mongodb.net:27017,test-database-shard-00-01-fhbyf.mongodb.net:27017,test-database-shard-00-02-fhbyf.mongodb.net:27017/admin?ssl=true&replicaSet=Test-Database-shard-0&authSource=admin&retryWrites=true&w=majority",
    testDBName: "storyquest-test"
};