const CryptoJS = require("crypto-js");
const db = require("../db/index.js");

module.exports = {
  //Adds tokens and relevant workspace information to the database
  oauth: async (workspace) => {
    // encrypt tokens
    const ciphertext = CryptoJS.AES.encrypt(
      workspace.access_token,
      process.env.SECRET_KEY
    ).toString();

    const workspaceDocument = {
      $setOnInsert: {
        workspace_id: workspace.team.id,
        workspace_name: workspace.team.name,
        token: ciphertext,
        channel: workspace.incoming_webhook.channel_id,
        channel_name: workspace.incoming_webhook.channel,
        authed_user: workspace.authed_user.id,
        timezone: workspace.tz,
      },
    };

    try {
      // insert the workspace into the db only if it has not already been added
      const insertToken = await db.WorkspaceData.collection.findOneAndUpdate(
        { workspace_id: workspace.team.id },
        workspaceDocument,
        {
          upsert: true,
        }
      );
      // if the inserted token gets inserted update the count collection
      if (!!!insertToken.value) {
        const updateCount = db.TokenCount.collection.updateOne(
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
    const data = await db.WorkspaceData.find();
    return data;
  },
  removeWorkspace: async (workspaceId) => {
    return await db.WorkspaceData.deleteMany({ workspace_id: workspaceId });
  },
  getMessage: async (collectionName) => {
    try {
      let message = await db[collectionName].findOneAndUpdate(
        { Sent: false },
        { $set: { Sent: true } }
      );
      if (!message) {
        await db[collectionName].updateMany({}, { $set: { Sent: false } });
        message = await db[collectionName].findOneAndUpdate(
          { Sent: false },
          { $set: { Sent: true } }
        );
      }
      return message;
    } catch (err) {
      console.error("Error Received in scheduled post: ", err);
    }
  },
};
