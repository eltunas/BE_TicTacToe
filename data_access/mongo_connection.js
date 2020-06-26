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
      console.log("se abrio la conexion con mongo");
    } catch (err) {
      console.log(err.message);
    }
  }
  return instance;
}

async function closeConnection() {
  if (instance) {
    try {
      await client.close();
      instance = null;
      console.log("se cerro la conexion con mongo");
    } catch (err) {
      console.log(err.message);
    }
  }
}

module.exports = { getConnection, closeConnection };
