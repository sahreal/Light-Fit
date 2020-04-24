const models = require("../models/index.js");

module.exports = {
  appOauth: async (req, res) => {
    const body = `code=${req.query.code}&client_id=${process.env.CLIENTID}&client_secret=${process.env.CLIENTSECRET}&redirect_uri=https://light-fit.herokuapp.com/app-slack-oauth`;
    const headers = { "Content-Type": "application/x-www-form-urlencoded" };

    let resp;
    try {
      resp = await axios.post("https://slack.com/api/oauth.v2.access", body, {
        headers,
      });
      models.oauth(resp.data);
    } catch (err) {
      console.log(`ERROR: ${JSON.stringify(err.response.data)}`);
    }

    (async () => {
      // send the user a welcome message whenever a user installs the slack app to their workspace
      // Use the access token and user id from the auth response
      const bot = new WebClient(resp.access_token);
      const addedChannel = resp.incoming_webhook.channel;

      const post = await bot.chat.postMessage({
        channel: resp.authed_user.id,
        text: `Hey I am coolBot. Thanks for adding me to the workspace. I will post messages to your ${addedChannel} channel`,
        as_user: "self",
      });
    })();
  },
};
