const { WebClient } = require("@slack/web-api");
const SlackToken = require("../SlackBot/token/SlackToken");
const axios = require("axios");

// Read a token from the environment variables
const token = SlackToken.token;
// Initialize
const web = new WebClient(token);

// Given some known conversation ID (representing a public channel, private channel, DM or group DM)
const conversationId = "general";

(async () => {
  // Post a message to the channel, and await the result.
  // Find more arguments and details of the response: https://api.slack.com/methods/chat.postMessage

  let name = await axios
    .get(`https://pokeapi.co/api/v2/pokemon/charmander`)
    .then(res => {
      //console.log(result.data);
      let pokemons = {
        pic: res.data.sprites.front_default,
        name: res.data.name
      };
      return pokemons;
    })
    .catch(err => console.log(err));

  const result = await web.chat.postMessage({
    text: "WOW",
    unfurl_media: true,
    //attachments: [{ title: name.name, image_url: name.pic }],
    channel: conversationId
  });

  // The result contains an identifier for the message, `ts`.
  console.log(
    `Successfully send message ${result.ts} in conversation ${conversationId}`
  );
})();

//-------------------------------------------------------------------------------------------------------------------
//** Ignore below code. Was using to experiment with Slack's new bot, the current working code is Slack's Classic bot
//-------------------------------------------------------------------------------------------------------------------

// const SlackBot = require("slackbots");
// const axios = require("axios");

// const bot = new SlackBot({
//   token: "xoxb-1041120149622-1039238871621-kLc0XsQzAHiGTUH22kiCLH6q",
//   name: "testtest"
// });

// bot.on("start", () => {
//   const params = {
//     icon_emoji: ":cat:"
//   };

//   bot.postMessageToChannel(
//     "general",
//     "WOOOOOOO SLACK APPPPPPPPPPPPPP",
//     params
//   );

//   //bot.postMessageToUser("user_name", "Hello world!", params);
// });

// //message handler
// bot.on("message", data => {
//   if (data.type !== "message") {
//     return;
//   } else {
//     let name = data.text.split(" ");

//     let result = getPokemon(name[1]);
//     return result;
//   }
// });

// bot.on("error", err => console.log(err));
