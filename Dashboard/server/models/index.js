const { Morning, Afternoon, MidDay, Evening } = require("../../db/index");
const MongoClient = require("mongodb").MongoClient;
const uri = require("../../config/key").mongoURI;
const client = new MongoClient(uri, { useNewUrlParser: true });

module.exports = {
  time: {
    get: function(callback) {
      client.connect((err, client) => {
        if (err) console.log(err, "failed to connect");
        else {
          console.log("connected");
          const collection = client.db("SlackApp").collection("Afternoon");
          collection.find(null, async (err, result) => {
            let temp = await result.toArray();
            callback(null, temp);
            client.close();
          });
        }
      });
    }
  }
};
