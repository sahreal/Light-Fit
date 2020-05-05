const cron = require("cron");
const { getMessage } = require("../models/index.js");

const scheduledTime = {
  Morning: { prompt: "", min: null },
  MidDay: { prompt: "", min: null },
  Afternoon: { prompt: "", min: null },
  Evening: { prompt: "", min: null },
};

module.exports = {
  getUnsentMessages: () => {
    const getDailyMessage = async () => {
      const min = Math.floor(Math.random() * 59 + 1);
      for (let time in scheduledTime) {
        let message = await getMessage(time);
        scheduledTime[time].prompt = message.Prompt;
        scheduledTime[time].min = min;
      }
    };
    let scheduledRun = new cron.CronJob(
      `0 0 6 * * 1-5`,
      getDailyMessage,
      null,
      true,
      "America/New_York"
    );
    getDailyMessage();
    scheduledRun.start();
  },
  dailyMessage: scheduledTime,
};
