const CryptoJS = require("crypto-js");
const db = require("../db/index.js");

module.exports = {
  //Adds tokens and relevant workspace information to the database
  oauth: async (workspace) => {
    // encrypt tokens
    workspace.$setOnInsert.token = CryptoJS.AES.encrypt(
      workspace.$setOnInsert.token,
      process.env.SECRET_KEY
    ).toString();

    try {
      // insert the workspace into the db only if it has not already been added
      const insertToken = await db.WorkspaceData.collection.findOneAndUpdate(
        { channel: workspace.$setOnInsert.channel },
        workspace,
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
      // Gets a message if the sent flag is set to false in DB
      let message = await db[collectionName].findOneAndUpdate(
        { Sent: false },
        { $set: { Sent: true } }
      );

      // Updates all flags to false if a message isn't found then grabs a message
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
