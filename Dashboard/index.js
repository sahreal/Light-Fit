const express = require("express");
const app = express();
const bodyParser = require("body-Parser");
const path = require("path");
const mongoose = require("mongoose");
const { Morning, MidDay, Afternoon, Evening } = require("./models/index");

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/dist/")));

const db = require("./config/key.js").mongoURI;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

const port = 3000;

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
