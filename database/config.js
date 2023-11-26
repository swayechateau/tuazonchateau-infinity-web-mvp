const { MongoClient } = require('mongodb');
// MongoDB connection URL
const mongoUrl = 'mongodb://swaye.dev:27017'; 
// Name of your MongoDB database
const dbName = 'tc-infinity'; 
// Store the message in MongoDB
MongoClient.connect(mongoUrl, (err, client) => {
    if (err) throw err;
    const db = client.db(dbName);
    // crud for application logic


});

function storeUser(d) {
    const messages = db.collection('users');

    // Insert the new message into the MongoDB collection
    messages.insertOne(data, (err, res) => {
        if (err) throw err;
        console.log('Message saved to MongoDB');
    });
    client.close();
}