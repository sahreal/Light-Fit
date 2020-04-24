const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const router = require("./routes.js");

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../dist/")));
app.use("/go", router);

const port = process.env.PORT || 3005;

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
