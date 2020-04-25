const cron = require("cron");
const { WebClient } = require("@slack/web-api");

const messageScheduler = async (token, channel, timezone) => {
  // initialize a bot client
  const bot = new WebClient(token);

  const scheduledTime = {
    morning: 14,
    midday: 14,
    afternoon: 14,
    evening: 14,
  };

  for (const time in scheduledTime) {
    // onTick function used in cron scheduler
    const onTick = async () => {
      await bot.chat.postMessage({
        channel: channel,
        text: getMessage(time), //Will be a function call to the db for a message
      });
    };

    // uses cron to schedule a job to run at the each time defined in the scheduledTime object
    const scheduleJob = () => {
      const hour = scheduledTime[time];
      const jobTime = `0 36 ${hour} * * 6`;
      const job = new cron.CronJob(jobTime, onTick, null, true, timezone);
      job.start();
    };
    scheduleJob();
  }
};

//Used for testing purposes. Will be removed when the models are built to interact with db
function getMessage(time) {
  let num = Math.ceil(Math.random() * 3);
  const messsages = {
    morning: {
      1: `This is ${time} message 1`,
      2: `This is ${time} message 2`,
      3: `This is ${time} message 3`,
    },
    midday: {
      1: `This is ${time} message 1`,
      2: `This is ${time} message 2`,
      3: `This is ${time} message 3`,
    },
    afternoon: {
      1: `This is ${time} message 1`,
      2: `This is ${time} message 2`,
      3: `This is ${time} message 3`,
    },
    evening: {
      1: `This is ${time} message 1`,
      2: `This is ${time} message 2`,
      3: `This is ${time} message 3`,
    },
  };

  return messsages[time][num];
}

module.exports = messageScheduler;
