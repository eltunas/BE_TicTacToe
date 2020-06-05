const MongoClient = require("mongodb").MongoClient;
const dotenv = require("dotenv");
dotenv.config();
const uri = process.env.MONGODB;

const client = new MongoClient(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

async function getConnection() {
  return await client.connect().catch(err => console.error(err));
}

module.exports = { getConnection };
