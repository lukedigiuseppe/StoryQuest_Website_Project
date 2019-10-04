module.exports = {
    // Currently set to Edmond's db
    mongoURI: "mongodb://pane:yoyo1029@appdb-shard-00-00-nuhsu.gcp.mongodb.net:27017,appdb-shard-00-01-nuhsu.gcp.mongodb.net:27017,appdb-shard-00-02-nuhsu.gcp.mongodb.net:27017/test?ssl=true&replicaSet=AppDB-shard-0&authSource=admin&retryWrites=true&w=majority",
    secretOrKey: "STORYQUESTROCKS",
    dbName: "storyquest",
    testMongoURI: "mongodb://pane:yoyo1029@test-database-shard-00-00-fhbyf.mongodb.net:27017,test-database-shard-00-01-fhbyf.mongodb.net:27017,test-database-shard-00-02-fhbyf.mongodb.net:27017/admin?ssl=true&replicaSet=Test-Database-shard-0&authSource=admin&retryWrites=true&w=majority",
    testDBName: "storyquest-test"
};