const cronMonitor = require("./cronMonitor.js").monitor;
const models = require("../models/index.js");

module.exports = {
  remove: async (event) => {
    const workspaceId = event.team_id;
    const jobs = cronMonitor[workspaceId]; // gets the job related to that workspace
    // Removes the job from the DB
    await models.removeWorkspace({ workspace_id: workspaceId });

    // iterate through the jobs and cancels each job.
    // Probably a better way but for now MVP
    for (let channels in jobs) {
      let channelsObjs = jobs[channels];
      for (let time in channelsObjs) {
        let job = channelsObjs[time];
        job.stop();
      }
    }
    delete jobs;
    return;
  },
  removeOne: async (event) => {
    const workspaceId = event.team_id;
    const channel = event.channel_id;
    const jobTimes = cronMonitor[workspaceId][channel];

    await models.removeWorkspace({ channel: channel });

    for (let times in jobTimes) {
      let job = jobTimes[times];
      job.stop();
    }
    return;
  },
};
