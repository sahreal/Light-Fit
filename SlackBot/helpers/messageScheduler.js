const cron = require("cron");
const { WebClient } = require("@slack/web-api");
const cronMonitor = require("./cronMonitor.js").monitor;
const { dailyMessage } = require("./getUnsentMessage.js");

const messageScheduler = async (token, channel, workspace) => {
  // initialize a bot client
  const bot = new WebClient(token);
  const timezone = "America/New_York";
  const scheduledTime = {
    Morning: 9,
    Midday: 12,
    Afternoon: 15,
    Evening: 17,
  };

  for (const time in scheduledTime) {
    // uses cron to schedule a job to run at the each time defined in the scheduledTime object
    const scheduleJob = () => {
      const hour = scheduledTime[time];
      const jobTime = `0 30 ${hour} * * 1-5`;

      // Scheduled job to execute
      const onTick = async () => {
        try {
          await bot.chat.postMessage({
            channel: channel,
            text: dailyMessage[time].prompt, // Pulled from daily refresh
          });
          // removes job from the cronMonitor object to avoid errors in workspace uninstall process
          cronMonitor[workspace][channel][time] = null;
          job.stop(); // stop the job from running
        } catch (err) {
          console.log(`Post Message Error: ${new Date()} \n ${err}`);
        }
      };

      // Fires each day the onTick completes
      const onComplete = () => {
        const hour = scheduledTime[time];
        const min = dailyMessage[time].min;
        let day = new Date().getDay();
        if (Number(day) >= 5) {
          day = 1;
        } else {
          day++;
        }

        const jobTime = `0 ${min} ${hour} * * ${day}`;

        let newJob = new cron.CronJob(
          jobTime,
          onTick,
          onComplete, // recursively call the onComplete
          true,
          timezone
        );

        cronMonitor[workspace][channel][time] = newJob;

        return newJob;
      };
      // schedules the initial cron job
      const job = new cron.CronJob(jobTime, onTick, onComplete, true, timezone);

      // stores the job in this large nested cronMonitor object for access
      if (cronMonitor[workspace]) {
        if (cronMonitor[workspace][channel]) {
          if (cronMonitor[workspace][channel][time]) {
            cronMonitor[workspace][channel][time] = job;
          } else {
            cronMonitor[workspace][channel][time] = job;
          }
        } else {
          cronMonitor[workspace][channel] = {};
          cronMonitor[workspace][channel][time] = job;
        }
      } else {
        cronMonitor[workspace] = {};
        cronMonitor[workspace][channel] = {};
        cronMonitor[workspace][channel][time] = job;
      }
      job.start();
    };
    scheduleJob();
  }
};

module.exports = messageScheduler;
