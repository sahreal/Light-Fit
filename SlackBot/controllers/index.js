const models = require("../models/index.js");
const axios = require("axios");
const { WebClient } = require("@slack/web-api");
const messageScheduler = require("../helpers/messageScheduler.js");
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

      let bot;
      if (token) {
        // If a token is received get the user's timezone info
        // Add it to the workspace object and send the object to the DB
        bot = new WebClient(token);
        const userTZ = await bot.users.info({
          token: token,
          user: userId
        });

        // format of the document to insert into the database
        const workspaceDocument = {
          $setOnInsert: {
            workspace_id: resp.data.team.id,
            workspace_name: resp.data.team.name,
            token: token,
            channel: resp.data.incoming_webhook.channel_id,
            channel_name: resp.data.incoming_webhook.channel,
            authed_user: resp.data.authed_user.id,
            timezone: userTZ.user.tz
          }
        };

        models.oauth(workspaceDocument);
        // schedule messages
        messageScheduler(
          token,
          addedChannel,
          userTZ.user.tz,
          resp.data.team.id
        );

        (async () => {
          // send the user a welcome message whenever a user installs the slack app to their workspace
          // Use the access token and user id from the auth response
          const post = await bot.chat.postMessage({
            channel: userId,
            text: `Hey I am Working Well by Light + Fit. Thanks for adding me to the workspace. I will post messages to your ${addedChannel} channel`,
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
    //Handle slack initial verification
    console.log(req.body, "REQ");
    if (req.body.challenge) {
      res.status(200).send({ challenge: req.body.challenge });
    }

    if (req.body.event.type === "app_uninstalled") {
      await slackEvents.remove(req.body);
      res.sendStatus(204);
    }

    /* TODO: App mention functionality. Possible use after initial authorization.
    Needs Event scope permissions */
    //if (req.body.event.type === "app_mention") {
    // const workspaceDocument = {
    //   $setOnInsert: {
    //     workspace_id: resp.body.team_id,
    //     workspace_name: resp.data.team.name,
    //     token: res.body.token,
    //     channel: resp.body.event.channel,
    //     channel_name: resp.data.incoming_webhook.channel,
    //     authed_user: resp.data.authed_user.id,
    //     timezone: userTZ.user.tz,
    //   },
    // };

    // await slackEvents.addBot(workspaceDocument);
    //}
  }
  // homeMessage: async (req, res) => {
  //   //Handle slack initial verification

  //   await slackEvents.app_home_opened(req.body);
  //}
};
