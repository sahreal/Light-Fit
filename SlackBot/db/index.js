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

const WorkspaceDataSchema = mongoose.Schema({
  workspace: {
    workspace_id: String,
    token: String,
    channel: String,
    channel_name: String,
    authed_user: String,
  },
});

const TokenCountSchema = mongoose.Schema({
  count: Number,
});

const Morning = new mongoose.Schema(
  {
    Prompt: String,
    Time: String
  },
  { collection: "Morning" }
);

const MidDay = new mongoose.Schema(
  {
    Prompt: String,
    Time: String
  },
  { collection: "Mid-day" }
);

const Afternoon = new mongoose.Schema(
  {
    Prompt: String,
    Time: String
  },
  { collection: "Afternoon" }
);

const Evening = new mongoose.Schema(
  {
    Prompt: String,
    Time: String
  },
  { collection: "Evening" }
);

const WorkspaceData = mongoose.model("Workspaces", WorkspaceDataSchema);
const TokenCount = mongoose.model("TokenCounts", TokenCountSchema);
const Morning = mongoose.model("Morning", Morning);
const MidDay = mongoose.model("MidDay", MidDay);
const Afternoon = mongoose.model("Afternoon", Afternoon);
const Evening = mongoose.model("Evening", Evening);

module.exports = { WorkspaceData, TokenCount,Morning,MidDay,Afternoon,Evening };
