const mongoose = require("mongoose");

mongoose.connect(process.env.MONGOURI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", () => {
  console.log("Connected to db...");
});

const WorkspaceDataSchema = new mongoose.Schema({
  workspace_id: String,
  token: String,
  channel: String,
  channel_name: String,
  authed_user: String,
  timezone: String,
});

const TokenCountSchema = new mongoose.Schema({
  count: Number,
});

const MorningSchema = new mongoose.Schema(
  {
    Prompt: String,
    Time: String,
  },
  { collection: "Morning" }
);

const MidDaySchema = new mongoose.Schema(
  {
    Prompt: String,
    Time: String,
  },
  { collection: "Mid-day" }
);

const AfternoonSchema = new mongoose.Schema(
  {
    Prompt: String,
    Time: String,
  },
  { collection: "Afternoon" }
);

const EveningSchema = new mongoose.Schema(
  {
    Prompt: String,
    Time: String,
  },
  { collection: "Evening" }
);

const WorkspaceData = mongoose.model("Workspaces", WorkspaceDataSchema);
const TokenCount = mongoose.model("TokenCounts", TokenCountSchema);
const Morning = mongoose.model("Morning", MorningSchema);
const MidDay = mongoose.model("MidDay", MidDaySchema);
const Afternoon = mongoose.model("Afternoon", AfternoonSchema);
const Evening = mongoose.model("Evening", EveningSchema);

module.exports = {
  WorkspaceData,
  TokenCount,
  Morning,
  MidDay,
  Afternoon,
  Evening,
};
