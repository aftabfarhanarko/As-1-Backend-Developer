const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://Arkoo:Arkoo1549@clustermyfirstmongodbpr.2cecfoe.mongodb.net/?retryWrites=true&w=majority&appName=ClusterMyFirstMongoDBPr";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function connectToMongoDB() {
  try {
    await client.connect();
    // database name (e.g., 'blogDB' or your chosen db name)
    db = client.db('blogDB');
    console.log("You successfully connected to MongoDB!");
    return db;
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }
}

function getDB() {
  return db;
}

// Call this only when your application terminates
async function disconnectFromMongoDB() {
  await client.close();
}

module.exports = {
  client,
  connectToMongoDB,
  getDB,
  disconnectFromMongoDB
};