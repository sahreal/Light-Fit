const Jwt = require("jsonwebtoken");
const secret = require("../../config/key.js");

module.exports = {
  verifyLogin: (req, res, next) => {
    const token = req.cookies["ww-token"];
    if (!token) return res.status(400).redirect("/login");

    try {
      const verified = Jwt.verify(token, secret.Secret_Token);
      req.user = verified;
      return next();
    } catch (err) {
      return res.status(400).redirect("/login");
    }
  },
  isLoggedIn: (req, res, next) => {
    const token = req.cookies["ww-token"];
    if (!token) return next();

    try {
      const verified = Jwt.verify(token, secret.Secret_Token);
      req.user = verified;
      return res.status(302).redirect("/home");
    } catch (err) {
      return next();
    }
  },
  createToken: (id) => {
    const token = Jwt.sign({ id: id }, secret.Secret_Token, {
      expiresIn: 3600000,
    });
    return token;
  },
};
