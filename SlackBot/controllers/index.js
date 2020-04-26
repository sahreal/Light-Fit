const models = require("../models/index.js");
const axios = require("axios");
const { WebClient } = require("@slack/web-api");
const messageScheduler = require("../helpers/messageScheduler.js");

module.exports = {
  appOauth: async (req, res) => {
    const body = `code=${req.query.code}&client_id=${process.env.CLIENTID}&client_secret=${process.env.CLIENTSECRET}&redirect_uri=https://light-fit.herokuapp.com/app-slack-oauth`;
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };

    let resp, token, addedChannel, userId;

    try {
      // call to slack oauth for new workspace data
      resp = await axios.post("https://slack.com/api/oauth.v2.access", body, {
        headers,
      });

      if (resp.ok === false) {
        throw new Error(resp.error);
      }

      token = await resp.data.access_token;
      addedChannel = await resp.data.incoming_webhook.channel;
      userId = await resp.data.authed_user.id;

      let bot;
      if (token) {
        // If a token is received get the user's timezone info
        // Add it to the workspace object and send the object to the DB
        bot = new WebClient(token);
        const userTZ = await bot.users.info({
          token: token,
          user: userId,
        });
        resp.data.tz = userTZ.user.tz;
        models.oauth(resp.data);
        // schedule messages
        messageScheduler(token, addedChannel, resp.data.tz);
      }

      (async () => {
        // send the user a welcome message whenever a user installs the slack app to their workspace
        // Use the access token and user id from the auth response
        const post = await bot.chat.postMessage({
          channel: userId,
          text: `Hey I am coolBot. Thanks for adding me to the workspace. I will post messages to your ${addedChannel} channel`,
          as_user: "self",
        });
      })();

      //TODO: A page to send the user to after they installed the bot
      res.send({ message: "Hello World", resp: resp.data });
    } catch (err) {
      console.log(`ERROR: ${err}`);
      res.send({ err: err });
    }
  },
};
