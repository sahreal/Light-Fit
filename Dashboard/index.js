const express = require("express");
const app = express();
const bodyParser = require("body-Parser");
const path = require("path");

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/dist/")));

const port = 3000;

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
