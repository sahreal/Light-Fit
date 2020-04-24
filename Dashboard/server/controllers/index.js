const models = require("../models/index");

module.exports = {
  times: {
    getAll: function(req, res) {
      models.time.get((err, results) => {
        if (err) {
          console.log("Error in controller get:", err);
          res.send(500);
        } else {
          console.log("Success in controller get");
          res.send(results).status(200);
        }
      });
    }
  }
};
