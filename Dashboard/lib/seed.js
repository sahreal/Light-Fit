const MongoClient = require("mongodb").MongoClient;
const fs = require("fs");

const uri = process.env.MONGOURI;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

client.connect(err => {
  if (err) {
    console.log(err);
  }
  const collection = client.db("SlackApp").collection("prompts");

  fs.readFile(
    "./lib/data.json",
    { encoding: "utf-8", flag: "rs" },
    (err, data) => {
      const slackPrompts = JSON.parse(data);
      collection
        .insertMany(slackPrompts)
        .then(data => {
          client.close();
        })
        .catch(err => {
          console.log(err);
          client.close();
        });
    }
  );
});
