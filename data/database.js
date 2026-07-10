const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let database;

async function connect() {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  database = client.db('online-shop');
}

function getDb() {
  if (!database) {
    throw new Error('Database not connected!');
  }
  return database;
}

module.exports = {
    connectToDatabase: connect,
    getDb: getDb
};