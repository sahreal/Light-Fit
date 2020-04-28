const cron = require("cron");
const { WebClient } = require("@slack/web-api");
const { Morning, Afternoon, MidDay, Evening } = require("../db/index");
const cronMonitor = require("./cronMonitor.js").monitor;

const messageScheduler = async (token, channel, timezone, workspace) => {
  // initialize a bot client
  const bot = new WebClient(token);

  const scheduledTime = {
    Morning: { time: 7, collection: Morning },
    Midday: { time: 8, collection: MidDay },
    Afternoon: { time: 9, collection: Afternoon },
    Evening: { time: 10, collection: Evening },
  };

  const getMessage = (timePeriod) => {
    let currentCollection = scheduledTime[timePeriod].collection;

    return currentCollection
      .find()
      .then((data) => {
        let index = Math.floor(Math.random() * (data.length - 1) + 1);
        bot.chat.postMessage({
          channel: channel,
          text: data[index].Prompt, //Will be a function call to the db for a message
        });
      })
      .catch((err) => console.error("Error Received in scheduled post: ", err));
  };

  for (const time in scheduledTime) {
    // uses cron to schedule a job to run at the each time defined in the scheduledTime object
    const scheduleJob = () => {
      const hour = scheduledTime[time].time;
      const min = Math.floor(Math.random() * 59 + 1);
      const jobTime = `0 30 ${hour} * * 1-5`;
      const onTick = () => {
        getMessage(time);
        job.stop();
      };
      // Fires each day the onTick completes
      const onComplete = () => {
        const hour = scheduledTime[time].time;
        const min = Math.floor(Math.random() * 59 + 1);
        let day = new Date().getDay();
        if (day === 5) {
          day = 1;
        } else {
          day++;
        }
        const jobTime = `0 34 ${hour} * * ${day}`;
        let newJob = new cron.CronJob(
          jobTime,
          onTick,
          onComplete,
          true,
          timezone
        );
        cronMonitor[workspace][time] = newJob;
        return newJob;
      };
      // schedules the initial cron job
      const job = new cron.CronJob(jobTime, onTick, onComplete, true, timezone);
      // stores the job in the cronMonitor object for access
      if (cronMonitor[workspace]) {
        cronMonitor[workspace][time] = job;
      } else {
        cronMonitor[workspace] = {};
        cronMonitor[workspace][time] = job;
      }
      job.start();
    };
    scheduleJob();
  }
};

module.exports = messageScheduler;
