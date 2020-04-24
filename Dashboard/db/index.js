var mongoose = require("mongoose");
const db = require("../config/key.js");

mongoose
  .connect(db.mongoURI, { useNewUrlParser: true })
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

var Schema = mongoose.Schema;

const Morning = new Schema(
  {
    Prompt: String,
    Time: String
  },
  { collection: "Morning" }
);

const MidDay = new Schema(
  {
    Prompt: String,
    Time: String
  },
  { collection: "Mid-day" }
);

const Afternoon = new Schema(
  {
    Prompt: String,
    Time: String
  },
  { collection: "Afternoon" }
);

const Evening = new Schema(
  {
    Prompt: String,
    Time: String
  },
  { collection: "Evening" }
);

module.exports.Morning = mongoose.model("Morning", Morning);
module.exports.MidDay = mongoose.model("MidDay", MidDay);
module.exports.Afternoon = mongoose.model("Afternoon", Afternoon);
module.exports.Evening = mongoose.model("Evening", Evening);
