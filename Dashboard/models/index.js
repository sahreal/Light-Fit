var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const Morning = new Schema(
  {
    Prompt: String,
    Time: String
  },
  { collection: "prompts" }
);

const MidDay = new Schema(
  {
    Prompt: String,
    Time: String
  },
  { collection: "prompts" }
);

const Afternoon = new Schema(
  {
    Prompt: String,
    Time: String
  },
  { collection: "prompts" }
);

const Evening = new Schema(
  {
    Prompt: String,
    Time: String
  },
  { collection: "prompts" }
);

module.exports.Morning = mongoose.model("Morning", Morning);
module.exports.MidDay = mongoose.model("MidDay", MidDay);
module.exports.Afternoon = mongoose.model("Afternoon", Afternoon);
module.exports.Evening = mongoose.model("Evening", Evening);
