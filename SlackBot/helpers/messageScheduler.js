const cron = require("cron");
const { WebClient } = require("@slack/web-api");

const { Morning, Afternoon, MidDay, Evening } = require("../db/index");
const mongoose = require("mongoose");
const uri = require("../token/DbKey").mongoURI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const messageScheduler = async (token, channel, timezone) => {
  // initialize a bot client
  const bot = new WebClient(token.token);

  const scheduledTime = {
    Morning: { time: 07, collection: Morning },
    Midday: { time: 11, collection: MidDay },
    Afternoon: { time: 15, collection: Afternoon },
    Evening: { time: 18, collection: Evening }
  };

  const getMessage = () => {
    var today = new Date();
    var currentHour = today.getHours();

    let currentCollection;
    for (let item in scheduledTime) {
      if (scheduledTime[item].time === currentHour) {
        currentCollection = scheduledTime[item].collection;
      }
    }

    return currentCollection
      .find()
      .then(data => {
        let index = Math.floor(Math.random() * (data.length - 1) + 1);
        bot.chat.postMessage({
          channel: channel,
          text: data[index].Prompt //Will be a function call to the db for a message
        });
      })
      .catch(err => console.log("FUCKIN ERROR"));
  };

  for (const time in scheduledTime) {
    // uses cron to schedule a job to run at the each time defined in the scheduledTime object
    const scheduleJob = () => {
      const hour = scheduledTime[time].time;
      var min = Math.floor(Math.random() * 59 + 1);
      const jobTime = `0 ${min} ${hour} * * 0-6`;
      const job = new cron.CronJob(jobTime, getMessage, null, true, timezone);
      job.start();
    };
    scheduleJob();
  }
};

module.exports = messageScheduler;
