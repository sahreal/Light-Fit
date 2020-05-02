const express = require("express");
const router = express.Router();
const controllers = require("./controllers/index");
const auth = require("./helpers/tokenVerification.js");
const serveStaticFile = require("./helpers/serveStaticFile.js").serveStaticFile;

router.get("/", auth.verifyLogin, (req, res) => {
  res.redirect("/home");
});

//GET
router.get("/getAll", controllers.command.getAll);
router.get("/countTokens", controllers.command.countTokens);
router.get("/topdata", controllers.command.recentlySent);
router.get("/home", auth.verifyLogin, serveStaticFile);
router.get("/login", auth.isLoggedIn, serveStaticFile);

//POST
router.post("/postOne", controllers.command.postOne);
router.post("/login", controllers.command.login);
router.post("/signup", controllers.command.addUser);

//UPDATE
router.put("/update", controllers.command.update);

//DELETE
router.delete("/deleteOne", controllers.command.deleteOne);
router.delete("/login", controllers.command.logout);

module.exports = router;
