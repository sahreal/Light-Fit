//-------------------------------------------------------------------------------------------------------------------
// CURRENT SLACK BOT
//-------------------------------------------------------------------------------------------------------------------

const express = require("express");
const app = express();
const routes = require("./routes/index.js");
const messageScheduler = require("./helpers/messageScheduler.js");

app.use("/", routes);

// Gets the slack bot token from environment variables
const token = process.env.TOKEN;

// Schedules for the default installed workspace
messageScheduler(token, "coolbot-test-sandbox", "America/New_York");
