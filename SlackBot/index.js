//-------------------------------------------------------------------------------------------------------------------
// CURRENT SLACK BOT
//-------------------------------------------------------------------------------------------------------------------
const db = require("./db/index.js");
const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const routes = require("./routes/index.js");
const reschedule = require("./helpers/messageRescheduler.js");
const dailyMessage = require("./helpers/getUnsentMessage.js");

app.use(express.static(path.join(__dirname, "./Landing_page /dist/")));
app.use(bodyParser.json());
app.use("/", routes);

// On server start up have the system reschedule all messages and set up the daily message and time scheduler
dailyMessage.getUnsentMessages();
reschedule.rescheduleMessages();

const port = process.env.PORT || 80;

app.listen(port, () =>
  console.log(`SlackBot is running locally http://localhost:${port}`)
);
