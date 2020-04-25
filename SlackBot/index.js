//-------------------------------------------------------------------------------------------------------------------
// CURRENT SLACK BOT
//-------------------------------------------------------------------------------------------------------------------
const db = require("./db/index.js");
const express = require("express");
const models = require("./models/index.js");
const app = express();
const routes = require("./routes/index.js");
const messageScheduler = require("./helpers/messageScheduler.js");

app.use("/", routes);

// Gets the slack bot token from environment variables
const token = process.env.TOKEN;

const temp = {
  ok: true,
  app_id: "A012DDW9GEQ",
  authed_user: { id: "U0127ST0RUM" },
  scope: "channels:join,chat:write,incoming-webhook,links:write,users:write",
  token_type: "bot",
  access_token: "xoxb-1070557268982-1084183399508-o1EisTBJh9m3o7gYGSx2kkBr",
  bot_user_id: "U012G5DBREY",
  team: { id: "T0122GD7WUW", name: "Bot-Sandbox" },
  enterprise: null,
  incoming_webhook: {
    channel: "#coolbot-test-sandbox",
    channel_id: "C012ZGXFG7J",
    configuration_url: "https://bot-sandboxhq.slack.com/services/B012JJ6G0JY",
    url:
      "https://hooks.slack.com/services/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",
  },
};

models.oauth(temp);

const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

// Schedules for the default installed workspace
messageScheduler(token, "coolbot-test-sandbox", "America/New_York");
