const CryptoJS = require("crypto-js");
const { WorkspaceData, TokenCount } = require("../db/index.js");

module.exports = {
  //Adds tokens and relevant workspace information to the database
  oauth: (workspace) => {
    const ciphertext = CryptoJS.AES.encrypt(
      workspace.access_token,
      process.env.SECRET_KEY
    ).toString();

    const workspaceData = {
      workspace_id: workspace.team.id,
      token: ciphertext,
      channel: workspace.incoming_webhook.channel_id,
      channel_name: workspace.incoming_webhook.channel,
      authed_user: workspace.authed_user.id,
    };

    console.log(workspaceData);

    const insertToken = WorkspaceData.insertMany([workspaceData]);
    const updateCount = TokenCount.updateOne(
      {},
      { $inc: { count: 1 } },
      (err, count) => {
        if (err) {
          console.log(err);
        }
      }
    );
  },
  decrypt: async () => {
    // Decrypts all the workspace tokens from the database. This will be used for message rescheduling
    try {
      const workspaceData = await db.workspace.WorkspaceData.find();
      workspaceData.forEach((workspace) => {
        const bytes = CryptoJS.AES.decrypt(
          workspace.token,
          process.env.SECRET_KEY
        );
        workspace.token = bytes.toString(CryptoJS.enc.Utf8);
      });

      return workspaceData;
    } catch (err) {
      console.log(`ERROR: ${err}`);
    }
  },
};
