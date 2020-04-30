const cronMonitor = require("./cronMonitor.js").monitor;
const models = require("../models/index.js");

module.exports = {
  remove: async (event) => {
    const workspaceId = event.team_id;
    const jobs = cronMonitor[workspaceId]; // gets the job related to that workspace
    // Removes the job from the DB
    await models.removeWorkspace(workspaceId);

    // iterate through the jobs and cancels each job
    for (let job in jobs) {
      jobs[job].stop();
    }

    delete jobs;
    return;
  },
  // TODO: Possible implementation after first approval.
  // Allows users to include the bot by mention. Incomplete implementation
  // addBot: async (event) => {
  //   await models.oauth();
  // },
};
