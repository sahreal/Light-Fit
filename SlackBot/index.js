//-------------------------------------------------------------------------------------------------------------------
// CURRENT SLACK BOT
//-------------------------------------------------------------------------------------------------------------------
const db = require("./db/index.js");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const routes = require("./routes/index.js");
const reschedule = require("./helpers/messageRescheduler.js");

app.use("/", routes);
app.use(bodyParser.json());

// On server start up have the system reschedule all messages
reschedule.rescheduleMessages();

const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
