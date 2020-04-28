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
const https = require("https");
var http = require("http");
const fs = require("fs");
var forceSsl = require("express-force-ssl");

const options = {
  key: fs.readFileSync("./sslCertificate/key.pem"),
  cert: fs.readFileSync("./sslCertificate/cert.pem")
};

app.use(express.static(path.join(__dirname, "./Landing_page /dist/")));
app.use(bodyParser.json());
app.use(forceSsl);
app.use("/", routes);

// On server start up have the system reschedule all messages
reschedule.rescheduleMessages();

const port = process.env.PORT || 3000;

https
  .createServer(options, app)
  .listen(443, () => console.log("SlackBot is on https"));
http.createServer(app).listen(80, () => console.log("Slackbot is on http"));
app.listen(port, () =>
  console.log(`SlackBot is running locally http://localhost:${port}`)
);

// https
//   .createServer(options, function(req, res) {
//     res.writeHead(200);
//     res.end("hello world\n");
//   })
//   .listen(port, () =>
//     console.log(`Example app listening at http://localhost:${port}`)
//   );
