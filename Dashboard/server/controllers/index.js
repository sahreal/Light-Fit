const {
  Morning,
  Afternoon,
  MidDay,
  Evening,
  tokenCounts,
} = require("../../db/index");

const timeOfDay = {
  Morning: Morning,
  MidDay: MidDay,
  Afternoon: Afternoon,
  Evening: Evening,
};

module.exports = {
  command: {
    getAll: (req, res) => {
      let time = req.query.timeOfDay;
      timeOfDay[time].collection.find(null, async function (err, results) {
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
      let time = req.body.timeOfDay;
      let result = { Prompt: req.body.input, Time: time };
      try {
        await timeOfDay[time].collection.insertOne(result);
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
          Time: request.Time,
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
      let time = req.body.Time;
      try {
        await timeOfDay[time].collection.deleteOne(result);
        res.sendStatus(200);
      } catch (err) {
        console.log(err, "delete promise error");
      }
    },
    countTokens: async (req, res) => {
      let count = await tokenCounts.find({});
      count = { count: count[0].count };
      res.status(200).send(count);
    },
    recentlySent: async (req, res) => {
      const recentMessages = {};
      try {
        for (let collection in timeOfDay) {
          recentMessages[collection] = await timeOfDay[
            collection
          ].collection.find({ Sent: true }, { $limit: 5 });
        }
        res.status(200).send(recentMessages);
      } catch (err) {
        console.log("ERROR: ", err);
        res.sendStatus(500);
      }
    },
  },
};
