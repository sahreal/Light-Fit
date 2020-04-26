const cron = require("cron");
const { WebClient } = require("@slack/web-api");
const { Morning, Afternoon, MidDay, Evening } = require("../db/index");
const cronMonitor = require("./cronMonitor.js");

const messageScheduler = async (token, channel, timezone, workspace) => {
  // initialize a bot client
  const bot = new WebClient(token);

  const scheduledTime = {
    Morning: 9,
    Midday: 12,
    Afternoon: 15,
    Evening: 18,
  };

  const getMessage = (time) => {
    const timeOfDay = {
      Morning: Morning,
      MidDay: MidDay,
      Afternoon: Afternoon,
      Evening: Evening,
    };

    return Afternoon.findOne()
      .then((data) => {
        bot.chat.postMessage({
          channel: channel,
          text: data.Prompt,
        });
      })
      .catch((err) => console.error("Error Received in scheduled post: ", err));
  };

  for (const time in scheduledTime) {
    // uses cron to schedule a job to run at the each time defined in the scheduledTime object
    const scheduleJob = () => {
      const hour = scheduledTime[time];
      const jobTime = `0 00 ${hour} * * 0`;
      const job = new cron.CronJob(jobTime, getMessage, null, true, timezone);
      // stores the job in the cronMonitor object for access
      cronMonitor[workspace]
        ? cronMonitor[workspace].push(job)
        : (cronMonitor[workspace] = [job]);
      job.start();
    };
    scheduleJob();
  }
};

module.exports = messageScheduler;
