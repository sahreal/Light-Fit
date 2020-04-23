const express = require("express");
const router = express.Router();
const controllers = require("./controllers/index");

router.get("/getAll", controllers.times.getAll);

module.exports = router;
