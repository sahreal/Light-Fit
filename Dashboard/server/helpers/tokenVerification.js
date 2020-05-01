const Jwt = require("jsonwebtoken");
const secret = require("../../config/key.js");

const isLoggedIn = (req, res, next) => {
  const token = req.header("ww-token");
  if (!token) return res.status(400).redirect("/login");

  try {
    const verified = Jwt.verify(token, secret.Secret_Token);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(400).redirect("/login");
  }
};

const createToken = (id) => {
  const token = Jwt.sign({ id: userExists._id }, secret.Secret_Token);
  return token;
};
module.exports = isLoggedIn;
module.exports = createToken;
