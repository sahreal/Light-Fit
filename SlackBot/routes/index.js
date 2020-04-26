const route = require("express").Router();
const controllers = require("../controllers/index.js");

route.get("/app-slack-oauth", controllers.appOauth);
route.post("/events", (req, res) => {
  console.log(req.body);
  res.send({ challenge: req.body.challenge });
});

module.exports = route;
