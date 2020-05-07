const CryptoJS = require("crypto-js");

module.exports = {
  slackVerify: (req, res, next) => {
    const timestamp = req.headers["x-slack-request-timestamp"];
    const slackHash = req.headers["x-slack-signature"];
    const reqBody = new URLSearchParams(req.body);
    const sig_basestring = `v0:${timestamp}:${reqBody}`;

    let string = CryptoJS.HmacSHA256(
      sig_basestring,
      process.env.TESTBOTSECRET
    ).toString();

    string = `v0=${string}`;

    // if the timestamp on the request is greater than 5 minutes return (Slack Verification Requirement)
    if (Math.floor(new Date().getTime() / 1000) - Number(timestamp) > 60 * 5)
      return null;

    // if the hash on the request is does not match do not process the request (Slack Verification Requirement)
    if (string === slackHash) {
      next();
    } else {
      return null;
    }
  },
};
