const MongoClient = require("mongodb").MongoClient;
const uri = require("../../config/key").mongoURI;
const { Morning, Afternoon, MidDay, Evening } = require("../../db/index");
const client = new MongoClient(uri, { useUnifiedTopology: true });

module.exports = {
  command: {
    getAll: (req, res) => {
      client.connect((err, client) => {
        if (err) res.sendStatus(500);
        else {
          console.log("get - connected");
          const collection = client.db("SlackApp").collection("Afternoon");
          collection.find(async (err, result) => {
            try {
              let temp = await result.toArray();
              res.send(temp).status(201);
            } catch (err) {
              console.log(err, "Get promise error");
            }
          });
        }
      });
    },
    postOne: (req, res) => {
      let result = req.body;
      client.connect(async (err, client) => {
        try {
          if (err) res.sendStatus(500);
          else {
            console.log("post - connected");
            const collection = client.db("SlackApp").collection("Afternoon");
            await collection.insertOne(result);
            res.sendStatus(201);
          }
        } catch {
          console.log(err, "post promise error");
        }
      });
    },
    update: (req, res) => {
      let request = req.body;
      client.connect((err, client) => {
        if (err) res.sendStatus(500);
        else {
          console.log("update - connected");
          const collection = client.db("SlackApp").collection("Afternoon");

          collection.findOneAndReplace(
            { Prompt: request.oldPrompt },
            {
              Prompt: request.Prompt,
              Time: request.Time
            },
            async (err, result) => {
              try {
                await result.value;
                res.sendStatus(200);
              } catch (err) {
                console.log(err);
              }
            }
          );
        }
      });
    },
    deleteOne: (req, res) => {
      let result = req.body;
      client.connect(async (err, client) => {
        try {
          if (err) res.sendStatus(500);
          else {
            console.log("delete - connected");
            const collection = client.db("SlackApp").collection("Afternoon");
            await collection.deleteOne(result);
            res.sendStatus(202);
          }
        } catch (err) {
          console.log(err);
        }
      });
    }
  }
};
