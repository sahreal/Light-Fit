const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const path = require("path");
const router = require("./routes.js");
const auth = require("./helpers/tokenVerification.js");

app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  express.static(path.join(__dirname, "../dist/"), {
    maxAge: 1,
    index: false,
  })
);

app.use("/", router);

const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
