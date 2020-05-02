const bcrypt = require("bcrypt");

module.exports = {
  encrypt: async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  },
  decrypt: async (password, dbPassword) => {
    const isValid = await bcrypt.compare(password, dbPassword);
    return isValid;
  },
};
