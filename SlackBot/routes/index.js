const router = require("express").Router();
const controllers = require("../controllers/index.js");
const slackVerify = require("../helpers/verification.js").slackVerify;

router.get("/app-slack-oauth", controllers.appOauth);
router.post("/events", slackVerify, controllers.events);
router.post("/commands", slackVerify, controllers.slashCommands);

module.exports = router;
