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
      // insert the channel into the db only if it has not already been added
      const insertToken = await db.WorkspaceData.collection.findOneAndUpdate(
        { channel: workspace.$setOnInsert.channel },
        workspace,
        {
          upsert: true,
        }
      );
      // if the inserted token gets inserted update the count collection with total distinct workspaces
      if (!!!insertToken.value) {
        const count = await db.WorkspaceData.collection.distinct(
          "workspace_id"
        );
        await db.TokenCount.collection.replaceOne({}, { count: count.length });
      }
    } catch (err) {
      console.log(err);
    }
  },
  getAllWorkspaces: async () => {
    const data = await db.WorkspaceData.find();
    return data;
  },
  getOneWorkspace: async (query) => {
    return await db.WorkspaceData.findOne(query);
  },
  removeWorkspace: async (query) => {
    return await db.WorkspaceData.deleteMany(query);
  },
  getMessage: async (collectionName) => {
    try {
      // Gets a message if the sent flag is set to false in DB and updates the flag and dates
      let message = await db[collectionName].findOneAndUpdate(
        { Sent: false },
        { $set: { Sent: true, LastSent: new Date().toJSON().slice(0, 10) } }
      );

      // Updates all flags to false if a message isn't found then grabs a message
      if (!message) {
        await db[collectionName].updateMany({}, { $set: { Sent: false } });
        message = await db[collectionName].findOneAndUpdate(
          { Sent: false },
          { $set: { Sent: true, LastSent: new Date().toJSON().slice(0, 10) } }
        );
      }
      return message;
    } catch (err) {
      console.error("Error Received in scheduled post: ", err);
    }
  },
};
