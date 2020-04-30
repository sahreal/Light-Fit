const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Morning = new Schema(
  {
    Prompt: String,
    Time: String,
    Sent: Boolean,
    LastSent: String,
  },
  { collection: "Morning" }
);

const MidDay = new Schema(
  {
    Prompt: String,
    Time: String,
    Sent: Boolean,
    LastSent: String,
  },
  { collection: "Mid-day" }
);

const Afternoon = new Schema(
  {
    Prompt: String,
    Time: String,
    Sent: Boolean,
    LastSent: String,
  },
  { collection: "Afternoon" }
);

const Evening = new Schema(
  {
    Prompt: String,
    Time: String,
    Sent: Boolean,
    LastSent: String,
  },
  { collection: "Evening" }
);

const tokenCounts = new Schema(
  {
    count: Number,
  },
  { collection: "tokencounts" }
);

//Time of day prompts collections
module.exports.Morning = mongoose.model("Morning", Morning);
module.exports.MidDay = mongoose.model("MidDay", MidDay);
module.exports.Afternoon = mongoose.model("Afternoon", Afternoon);
module.exports.Evening = mongoose.model("Evening", Evening);

//Download count
module.exports.tokenCounts = mongoose.model("tokenCounts", tokenCounts);
