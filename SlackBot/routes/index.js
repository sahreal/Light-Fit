const router = require("express").Router();
const controllers = require("../controllers/index.js");

router.get("/app-slack-oauth", controllers.appOauth);
router.post("/events", controllers.events);

module.exports = router;
