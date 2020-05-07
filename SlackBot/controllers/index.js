const models = require("../models/index.js");
const axios = require("axios");
const { WebClient } = require("@slack/web-api");
const messageScheduler = require("../helpers/messageScheduler.js");
const CryptoJS = require("crypto-js");
const slackEvents = require("../helpers/slackEvents.js");

module.exports = {
  appOauth: async (req, res) => {
    // handles users canceling the app installation process
    if (req.query.error) {
      res.status(302).redirect("https://lightandfitworkingwell.app:443/");
      return;
    }

    const body = `code=${req.query.code}&client_id=${process.env.CLIENTID}&client_secret=${process.env.CLIENTSECRET}&redirect_uri=https://lightandfitworkingwell.app:443/app-slack-oauth`;
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };
    let resp, token, addedChannel, userId;

    try {
      // call to slack oauth for new workspace data
      resp = await axios.post("https://slack.com/api/oauth.v2.access", body, {
        headers,
      });

      if (resp.data.ok === false) {
        throw new Error(resp.data.error);
      }

      token = await resp.data.access_token;
      addedChannel = await resp.data.incoming_webhook.channel;
      userId = await resp.data.authed_user.id;

      if (token) {
        // If a token is received send the workspace object to the DB
        // format of the document to insert into the database
        const workspaceDocument = {
          $setOnInsert: {
            workspace_id: resp.data.team.id,
            workspace_name: resp.data.team.name,
            token: token,
            channel: resp.data.incoming_webhook.channel_id,
            channel_name: resp.data.incoming_webhook.channel,
            authed_user: resp.data.authed_user.id,
          },
        };

        models.oauth(workspaceDocument);
        // schedule messages
        messageScheduler(token, addedChannel, resp.data.team.id);

        (async () => {
          // send the user a welcome message whenever a user installs the slack app to their workspace
          // Use the access token and user id from the auth response
          const bot = new WebClient(token);
          const post = await bot.chat.postMessage({
            channel: userId,
            text: `Hey there, thanks for welcoming me to your workspace! I am Working Well by Light + Fit and I will be sending daily tips, reminders and videos to add some light and wellness to your routine. (Spoiler alert: get ready to drink a lot of water).`,
            as_user: "self",
          });
        })();
      }

      res.status(302).redirect("https://slack.com/apps/A012DDW9GEQ");
    } catch (err) {
      console.error(`ERROR: ${err}`);
      res.status(302).redirect("https://lightandfitworkingwell.app:443/");
    }
  },
  events: async (req, res) => {
    //Handle slack initial verification
    if (req.body.challenge) {
      return res.status(200).send({ challenge: req.body.challenge });
    }

    res.sendStatus(200); // Must send slack an immediate response or it sends multiple retries

    /*
    ================================
    UNINSTALLED FROM WORKSPACE 
    ================================
    */

    if (req.body.event.type === "app_uninstalled") {
      await slackEvents.remove(req.body);
    }

    /*
    ==================================
    INVITED TO THE CHANNEL BY @MENTION
    ==================================
    */

    // if the user adds the bot to a channel add it in the db and schedule messages
    if (req.body.event.type === "member_joined_channel") {
      // get the token associated with the requested workspace.
      // create a bot client and get the user info
      const token = await slackEvents.getToken(req.body);

      const bot = new WebClient(token);

      let userData = await bot.users.info({
        token: token,
        user: req.body.event.user,
      });

      // compares the user profile api id to the slack bot api id listed on the website
      if (userData.user.profile.api_app_id !== process.env.APPID) return;

      const channel = request.event.channel;
      let isAdded = await models.getOneWorkspace({ channel: channel });
      if (!isAdded) {
        const workspaceDocument = {
          $setOnInsert: {
            workspace_id: request.team_id,
            workspace_name: workspace.workspace_name,
            token: token,
            channel: request.event.channel,
            channel_name: null,
            authed_user: request.event.inviter,
          },
        };
        // add the workspace document then schedule the messages
        await models.oauth(workspaceDocument);
        messageScheduler(token, request.event.channel, request.team_id);
      }
    }
    /*
    ================================
    REMOVED FROM WORKSPACE BY SLACK 
    ================================
    */

    if (
      req.body.event.channel_type === "im" &&
      req.body.event.text.includes("You have been removed")
    ) {
      const token = await slackEvents.getToken(req.body);
      const bot = new WebClient(token);
      let channel = req.body.event.text.split(" ").filter((word) => {
        if (word[0] === "#") return word;
      });
      let test = await bot.conversations.list({
        token: token,
      });
      let id = test.channels.filter((chan) => {
        if (`#${chan.name}` === channel[0]) {
          return chan;
        }
      });
      id = id[0].id;

      let workspaceData = { team_id: workspaceId, channel_id: id };

      slackEvents.removeOne(workspaceData);
    }

    /*
    ================================
    USER MESSAGES SLACKBOT 
    ================================
    */

    // if a user IMs the slackbot
    if (req.body.event.channel_type === "im") {
      if (req.body.event.bot_id || req.body.event.user === "USLACKBOT")
        return null; // if the message is from the bot return
      const token = await slackEvents.getToken(req.body);
      const bot = new WebClient(token);

      let userId = request.event.user;

      // Message to send to user when contacting the app
      const post = await bot.chat.postMessage({
        channel: userId,
        text: `Thank you for reaching out to Working Well by Light + Fit, this is an automated bot only meant to send scheduled messages every few hours`,
        as_user: "self",
      });
    }
  },
  // slash command to stop the bot from posting in a single channel.
  // However the person would need to also remove the app from the channel if it was invited to the channel.
  slashCommands: async (req, res) => {
    // if "help" is sent with the slash command it responds with a help message
    if (req.body.text.toLowerCase().includes("help")) {
      return res
        .status(200)
        .send(
          "You can use the '/revoke' slash command in any channel that Working Well by Light + Fit sends a message in. This will remove Working Well's permissions to send messages in the channel. \n \n If Working Well is a memeber of the channel, ask the workspace administrator to remove the app as a member of the channel instead."
        );
    }

    // removes the bot from the db
    let removed = await slackEvents.removeOne(req.body);

    // if removed variable returns null send this message to the user
    if (!removed) {
      return res
        .status(200)
        .send(
          "Working Well by Light + Fit does not have the permissions to post in this channel. You can use the /revoke command in channels that Working Well by Light + Fit posts messages into. "
        );
    } else {
      return res
        .status(200)
        .send(
          "Working Well by Light + Fit will stop posting in this channel. Please ask your workspace administrator to remove me from the channel if I am a member."
        );
    }
  },
};
