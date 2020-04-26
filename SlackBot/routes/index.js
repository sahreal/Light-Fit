const route = require("express").Router();
const controllers = require("../controllers/index.js");
const cronMonitor = require("../helpers/cronMonitor.js").monitor;

route.get("/app-slack-oauth", controllers.appOauth);
route.post("/events", controllers.remove);

module.exports = route;
