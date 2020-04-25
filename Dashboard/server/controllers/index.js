const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const uri = require("../../config/key").mongoURI;
const { Morning, Afternoon, MidDay, Evening } = require("../../db/index");
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const timeOfDay = {
  Morning: Morning,
  MidDay: MidDay,
  Afternoon: Afternoon,
  Evening: Evening
};

module.exports = {
  command: {
    getAll: (req, res) => {
      console.log(req.query, "HEY");
      let time = req.query.timeOfDay;
      timeOfDay[time].collection.find(null, async function(err, results) {
        if (err) {
          return console.error(err);
        } else {
          try {
            let temp = await results.toArray();
            res.send(temp).status(201);
          } catch (err) {
            console.log(err, "Get promise error");
          }
        }
      });
    },
    postOne: async (req, res) => {
      let result = req.body;
      try {
        await Afternoon.collection.insertOne(result);
        res.sendStatus(200);
      } catch (err) {
        console.log(err, "update post error");
      }
    },
    update: (req, res) => {
      let request = req.body;

      Afternoon.collection.findOneAndReplace(
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
            console.log(err, "update promise error");
          }
        }
      );
    },
    deleteOne: async (req, res) => {
      let result = req.body;
      try {
        await Afternoon.collection.deleteOne(result);
        res.sendStatus(200);
      } catch (err) {
        console.log(err, "delete promise error");
      }
    }
  }
};
