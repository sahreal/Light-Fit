const route = require("express").Router();
const controllers = require("../controllers/index.js");

route.get("/app-slack-oauth", controllers.appOauth);

module.exports = route;
