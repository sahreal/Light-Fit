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
    Morning: 9,
    Midday: 12,
    Afternoon: 15,
    Evening: 18
  };

  const getMessage = time => {
    const timeOfDay = {
      Morning: Morning,
      MidDay: MidDay,
      Afternoon: Afternoon,
      Evening: Evening
    };

    return Afternoon.findOne()
      .then(data => {
        bot.chat.postMessage({
          channel: channel,
          text: data.Prompt //Will be a function call to the db for a message
        });
      })
      .catch(err => console.log("FUCKIN ERROR"));
  };

  for (const time in scheduledTime) {
    // uses cron to schedule a job to run at the each time defined in the scheduledTime object
    const scheduleJob = () => {
      const hour = scheduledTime[time];
      const jobTime = `10 40 ${hour} * * 6`;
      const job = new cron.CronJob(jobTime, getMessage, null, true, timezone);
      job.start();
    };
    scheduleJob();
  }
};

module.exports = messageScheduler;
