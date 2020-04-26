const CryptoJS = require("crypto-js");
const models = require("../models/index.js");
const messageScheduler = require("./messageScheduler.js");
module.exports = {
  rescheduleMessages: async () => {
    try {
      const data = await models.getAllWorkspaces();
      data.forEach((workspace) => {
        workspace = workspace.toJSON();
        let bytes = CryptoJS.AES.decrypt(
          workspace.token,
          process.env.SECRET_KEY
        );
        workspace.token = bytes.toString(CryptoJS.enc.Utf8);
        messageScheduler(
          workspace.token,
          workspace.channel,
          workspace.timezone
        );
      });
    } catch (err) {
      console.log(err);
    }
  },
};
