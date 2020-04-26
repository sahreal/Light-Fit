const CryptoJS = require("crypto-js");
const models = require("../models/index.js");
const messageScheduler = require("./messageScheduler.js");
module.exports = {
  rescheduleMessages: async () => {
    try {
      const data = await models.getAllWorkspaces();
      data.forEach((workspace) => {
        workspace = workspace.toJSON(); // converts the workspace data to a JSON object we can manipulate
        let bytes = CryptoJS.AES.decrypt(
          workspace.token,
          process.env.SECRET_KEY
        );
        workspace.token = bytes.toString(CryptoJS.enc.Utf8);
        messageScheduler(
          workspace.token,
          workspace.channel,
          workspace.timezone,
          workspace.workspace_id
        );
      });
    } catch (err) {
      console.log(err);
    }
  },
};
