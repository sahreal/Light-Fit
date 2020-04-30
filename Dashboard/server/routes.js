const express = require("express");
const router = express.Router();
const controllers = require("./controllers/index");

//GET
router.get("/getAll", controllers.command.getAll);
router.get("/countTokens", controllers.command.countTokens);
router.get("/topdata", controllers.command.recentlySent);

//POST
router.post("/postOne", controllers.command.postOne);

//UPDATE
router.put("/update", controllers.command.update);

//DELETE
router.delete("/deleteOne", controllers.command.deleteOne);

module.exports = router;
