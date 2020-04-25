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

const WorkspaceData = mongoose.model("Workspaces", WorkspaceDataSchema);
const TokenCount = mongoose.model("TokenCounts", TokenCountSchema);

module.exports = { WorkspaceData, TokenCount };
