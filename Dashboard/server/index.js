const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const axios = require("axios");
const router = require("./routes.js");

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../dist/")));
app.use("/", router);

app.get("/app-slack-oauth", (req, res) => {
  const body = `code=${req.query.code}&client_id=${process.env.CLIENTID}&client_secret=${process.env.CLIENTSECRET}&redirect_uri=https://light-fit.herokuapp.com/app-slack-oauth`;
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };

  axios
    .post("https://slack.com/api/oauth.v2.access", body, { headers })
    .then(resp => {
      res.send(resp.data);
    })
    .catch(err => {
      console.log(`ERROR: ${JSON.stringify(err.response.data)}`);
    });
});

const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
