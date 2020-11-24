const MongoClient = require('mongodb').MongoClient;
require("dotenv").config();
const uri = process.env.mongodbconn;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true })

module.exports = new Promise((res, rej) => {
    client.connect(err => err ? rej(err) : res(client));
});
