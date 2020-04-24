//-------------------------------------------------------------------------------------------------------------------
// CURRENT SLACK BOT
//-------------------------------------------------------------------------------------------------------------------

const express = require("express");
const app = express();
const routes = require("./routes/index.js");
const messageScheduler = require("./helpers/messageScheduler.js");

// Gets the slack bot token from environment variables
const token = process.env.TOKEN;

app.use("/", routes);

/* Used for testing the messageScheduler. messageScheduler will be placed in the oauth route
    to handle scheduling the messages whenever a new workspace installs coolbot */
const tokens = [
  token,
  "xoxb-1070557268982-1084183399508-o1EisTBJh9m3o7gYGSx2kkBr",
];

tokens.forEach((token) => {
  messageScheduler(token, "coolbot-test-sandbox", "America/New_York");
});
