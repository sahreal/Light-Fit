const models = require("../models/index.js");
const axios = require("axios");
const { WebClient } = require("@slack/web-api");
const messageScheduler = require("../helpers/messageScheduler.js");
const cronMonitor = require("../helpers/cronMonitor.js").monitor;

module.exports = {
  appOauth: async (req, res) => {
    const body = `code=${req.query.code}&client_id=${process.env.CLIENTID}&client_secret=${process.env.CLIENTSECRET}&redirect_uri=https://lightandfitworkingwell.app:443/app-slack-oauth`;
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    console.log("Happened");
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
        messageScheduler(token, addedChannel, resp.data.tz, resp.data.team.id);
      }

      (async () => {
        // send the user a welcome message whenever a user installs the slack app to their workspace
        // Use the access token and user id from the auth response
        const post = await bot.chat.postMessage({
          channel: userId,
          text: `Hey I am Working Well by Light + Fit. Thanks for adding me to the workspace. I will post messages to your ${addedChannel} channel`,
          as_user: "self",
        });
      })();

      //TODO: A page to send the user to after they installed the bot
      res
        .status(301)
        .redirect("https://slack.com/apps/A012DDW9GEQ-coolbot?next_id=0");
    } catch (err) {
      console.error(`ERROR: ${err}`);
    }
  },
  remove: async (req, res) => {
    //Handle slack initial verification
    if (req.body.challenge) {
      res.status(200).send({ challenge: req.body.challenge });
    }

    const workspaceId = req.body.team_id;
    const jobs = cronMonitor[workspaceId]; // gets the job related to that workspace

    // Removes the job from the DB
    await models.removeWorkspace(workspaceId);

    // iterate through the jobs and cancels each job
    for (let job in jobs) {
      jobs[job].stop();
    }

    delete jobs;

    res.sendStatus(204);
  },
};
