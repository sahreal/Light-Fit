const express = require("express");
const router = express.Router();
const controllers = require("./controllers/index");

router.get("/getAll", controllers.command.getAll);
router.post("/postOne", controllers.command.postOne);
router.put("/update", controllers.command.update);
router.delete("/deleteOne", controllers.command.deleteOne);

module.exports = router;
