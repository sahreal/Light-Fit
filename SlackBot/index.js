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

const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);

// Schedules for the default installed workspace
messageScheduler(token, "coolbot-test-sandbox", "America/New_York");
