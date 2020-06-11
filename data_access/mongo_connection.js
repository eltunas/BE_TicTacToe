const MongoClient = require("mongodb").MongoClient;
const dotenv = require("dotenv");
dotenv.config();
const uri = process.env.MONGODB;

const client = new MongoClient(uri, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

let instance = null;

async function getConnection() {
  if (instance == null) {
    try {
      instance = await client.connect();
    } catch (err) {
      console.log(err.message);
    }
  }
  return instance;
}

module.exports = { getConnection };
