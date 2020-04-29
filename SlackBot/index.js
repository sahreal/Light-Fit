//-------------------------------------------------------------------------------------------------------------------
// CURRENT SLACK BOT
//-------------------------------------------------------------------------------------------------------------------
const db = require("./db/index.js");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const routes = require("./routes/index.js");
const reschedule = require("./helpers/messageRescheduler.js");
const dailyMessage = require("./helpers/getUnsentMessage.js");

app.use(bodyParser.json());
app.use("/", routes);

// On server start up have the system reschedule all messages
dailyMessage.getUnsentMessages();
reschedule.rescheduleMessages();

const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
