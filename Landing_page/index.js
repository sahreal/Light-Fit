const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "dist")));

const port = 4000;

app.listen(port, () =>
  console.log(`Landing page app listening at http://localhost:${port}`)
);
