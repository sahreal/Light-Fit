const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
<<<<<<< HEAD
const mongoose = require("mongoose");
const { Morning, MidDay, Afternoon, Evening } = require("./models/index");
=======
const axios = require("axios");
>>>>>>> 84ba76c2e7eaffb379f243fed9803d7f1a5ba21d

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/dist/")));

<<<<<<< HEAD
const db = require("./config/key.js").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

const port = 3000;
=======
app.get("/app-slack-oauth", (req, res) => {
  const body = `code=${req.query.code}&client_id=${process.env.CLIENTID}&client_secret=${process.env.CLIENTSECRET}&redirect_uri=https://light-fit.herokuapp.com/app-slack-oauth`;
  const headers = { "Content-Type": "application/x-www-form-urlencoded" };

  axios
    .post("https://slack.com/api/oauth.v2.access", body, { headers })
    .then((resp) => {
      res.send(resp.data);
    })
    .catch((err) => {
      console.log(`ERROR: ${JSON.stringify(err.response.data)}`);
    });
});

const port = process.env.PORT || 3000;
>>>>>>> 84ba76c2e7eaffb379f243fed9803d7f1a5ba21d

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
