const CryptoJS = require("crypto-js");
const { WorkspaceData, TokenCount } = require("../db/index.js");

module.exports = {
  //Adds tokens and relevant workspace information to the database
  oauth: async (workspace) => {
    // encrypt tokens
    const ciphertext = CryptoJS.AES.encrypt(
      workspace.access_token,
      process.env.SECRET_KEY
    ).toString();

    const workspaceData = {
      $setOnInsert: {
        workspace_id: workspace.team.id,
        token: ciphertext,
        channel: workspace.incoming_webhook.channel_id,
        channel_name: workspace.incoming_webhook.channel,
        authed_user: workspace.authed_user.id,
        timezone: workspace.tz,
      },
    };

    try {
      // insert the workspace into the db only if it has not already been added
      const insertToken = await WorkspaceData.collection.findOneAndUpdate(
        { workspace_id: workspace.team.id },
        workspaceData,
        {
          upsert: true,
        }
      );
      // if the inserted token gets inserted update the count collection
      if (!!!insertToken.value) {
        const updateCount = TokenCount.collection.updateOne(
          {},
          { $inc: { count: 1 } },
          { upsert: true }
        );
      }
    } catch (err) {
      console.log(err);
    }
  },
  getAllWorkspaces: async () => {
    // Decrypts all the workspace tokens from the database. This will be used for message rescheduling
    const data = await WorkspaceData.find();
    return data;
  },
};
