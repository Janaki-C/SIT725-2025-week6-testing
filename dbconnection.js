const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';  // ✅ Local MongoDB URI
const client = new MongoClient(uri);      // ✅ No extra options

let db;

async function connectToDatabase() {
    try {
        await client.connect();
        db = client.db('contentDB');      // ✅ DB name as seen in Compass
        console.log('✅ Connected to MongoDB');
        return db;
    } catch (error) {
        console.error('❌ Failed to connect to MongoDB:', error);
        throw error;
    }
}

function getDb() {
    if (!db) throw new Error('Database not initialized.');
    return db;
}

module.exports = {
    connectToDatabase,
    getDb
};
