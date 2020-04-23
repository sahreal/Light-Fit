/*====================================
CLASSIC SLACK BOT
======================================*/
// const { WebClient } = require("@slack/web-api");
// const SlackToken = require("../SlackBot/token/SlackToken");
// const axios = require("axios");

// // Read a token from the environment variables
// const token = SlackToken.token;
// // Initialize
// const web = new WebClient(token);

// // Given some known conversation ID (representing a public channel, private channel, DM or group DM)
// const conversationId = "general";

// (async () => {
//   // Post a message to the channel, and await the result.
//   // Find more arguments and details of the response: https://api.slack.com/methods/chat.postMessage

//   let name = await axios
//     .get(`https://pokeapi.co/api/v2/pokemon/charmander`)
//     .then(res => {
//       //console.log(result.data);
//       let pokemons = {
//         pic: res.data.sprites.front_default,
//         name: res.data.name
//       };
//       return pokemons;
//     })
//     .catch(err => console.log(err));

//   const result = await web.chat.postMessage({
//     text: "WOW",
//     unfurl_media: true,
//     //attachments: [{ title: name.name, image_url: name.pic }],
//     channel: conversationId
//   });

//   // The result contains an identifier for the message, `ts`.
//   console.log(
//     `Successfully send message ${result.ts} in conversation ${conversationId}`
//   );
// })();

//-------------------------------------------------------------------------------------------------------------------
// CURRENT SLACK BOT
//-------------------------------------------------------------------------------------------------------------------

const { WebClient } = require("@slack/web-api");
const CronJob = require("cron").CronJob;

// Gets the slack bot token from environment variables
const token = process.env.TOKEN;

// Initialize web client connection with the token
const bot = new WebClient(token);

// CronJob schedules posts to be sent
// TODO: How to send posts to channels outside the initial installed workspace
(async () => {
  const setPresence = await bot.users.setPresence({
    token: token,
    presence: "auto"
  });

  const post = await bot.chat.postMessage({
    channel: "coolbot-test-sandbox",
    text: "Hey I am coolBot. I'm testing this"
  });

  const morningJob = new CronJob(
    "00 00 9 * * 1-5",
    async function() {
      await bot.chat.postMessage({
        channel: "coolbot-test-sandbox",
        text:
          "Hey I am coolBot. I post a daily 9am message. Get some coffee :coffee"
      });
    },
    null,
    true,
    "America/New_York"
  );
  const middayJob = new CronJob(
    "00 00 12 * * 1-5",
    async function() {
      await bot.chat.postMessage({
        channel: "coolbot-test-sandbox",
        text:
          "Hey I am coolBot. I post a daily 12pm message. Get some lunch! That work will still be there after. TRUST ME."
      });
    },
    null,
    true,
    "America/New_York"
  );
  const afternoonJob = new CronJob(
    "00 00 15 * * 1-5",
    async function() {
      await bot.chat.postMessage({
        channel: "coolbot-test-sandbox",
        text:
          "Hey I am coolBot. I post a daily 3pm message. It's almost clock out time! Get Excited!!"
      });
    },
    null,
    true,
    "America/New_York"
  );
  const eveningJob = new CronJob(
    "00 00 18 * * 1-5",
    async function() {
      await bot.chat.postMessage({
        channel: "coolbot-test-sandbox",
        text:
          "Hey I am coolBot. I post a daily 6pmm message. Get some dinner or drinks, it's after 5 here!"
      });
    },
    null,
    true,
    "America/New_York"
  );
  morningJob.start();
  middayJob.start();
  afternoonJob.start();
  eveningJob.start();
})();
