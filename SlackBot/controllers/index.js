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
        headers
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
            authed_user: resp.data.authed_user.id
          }
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
            text: `Hey there, thanks for welcoming me to your workspace! I am Working Well by Light + Fit and I will be sending daily tips, reminders and videos to add some light and wellness to your routine. (Spoiler alert: get ready to drink a lot of water).`,
            as_user: "self"
          });
        })();
      }

      res
        .status(302)
        .redirect("https://slack.com/apps/A012DDW9GEQ-coolbot?next_id=0");
    } catch (err) {
      console.error(`ERROR: ${err}`);
      res.status(302).redirect("https://lightandfitworkingwell.app:443/");
    }
  },
  events: async (req, res) => {
    res.sendStatus(200); // Must send slack an immediate response or it sends multiple retries

    console.log(req.body);
    //Handle slack initial verification
    console.log(req.body, "REQ");
    if (req.body.challenge) {
      return res.status(200).send({ challenge: req.body.challenge });
    }

    // checks request validity. Whether the request came from Slack or not
    if (req.body.token !== process.env.VERIFICATIONID) {
      return;
    }

    if (req.body.event.type === "app_uninstalled") {
      await slackEvents.remove(req.body);
    }

    // if the user adds the bot to a channel
    if (req.body.event.type === "member_joined_channel") {
      if (process.env.APPID !== req.body.event.user) return;

      const request = req.body;
      const workspaceId = request.team_id;
      const channel = request.event.channel;
      let isAdded = await models.getOneWorkspace({ channel: channel });
      if (!isAdded) {
        let workspace = await models.getOneWorkspace({
          workspace_id: workspaceId
        });
        workspace = workspace.toJSON();
        let token = workspace.token;
        token = CryptoJS.AES.decrypt(token, process.env.SECRET_KEY);
        token = token.toString(CryptoJS.enc.Utf8);

        const workspaceDocument = {
          $setOnInsert: {
            workspace_id: request.team_id,
            workspace_name: workspace.workspace_name,
            token: token,
            channel: request.event.channel,
            channel_name: null,
            authed_user: request.event.inviter
          }
        };
        await models.oauth(workspaceDocument);
        messageScheduler(token, request.event.channel, request.team_id);
      }
    }

    // if a user IMs the slackbot
    if (req.body.event.channel_type === "im") {
      if (req.body.event.bot_id) return; // if the message is from the bot return
      const request = req.body;
      const workspaceId = request.team_id;
      let workspace = await models.getOneWorkspace({
        workspace_id: workspaceId
      });
      workspace = workspace.toJSON();
      let token = workspace.token;
      token = CryptoJS.AES.decrypt(token, process.env.SECRET_KEY);
      token = token.toString(CryptoJS.enc.Utf8);
      const bot = new WebClient(token);

      let test = await bot.conversations.info({
        token: token,
        channel: request.event.channel
      });
      let userId = request.event.user;

      const post = await bot.chat.postMessage({
        channel: userId,
        text: `Thank you for reaching out to Working Well by Light + Fit, this is an automated bot only meant to send scheduled messages every few hours`, // Message to send to user when contacting the app
        as_user: "self"
      });
    }
  },
  slashCommands: (req, res) => {
    // slash command to stop the bot from posting in a single channel.
    // However the person would need to also remove the app from the channel if it was invited to the channel.
    slackEvents.removeOne(req.body);
    return res
      .status(200)
      .send(
        "Working Well by Light + Fit will stop posting in this channel. Please ask your workspace administrator to remove me from the channel if I am a member."
      );
  }
};
