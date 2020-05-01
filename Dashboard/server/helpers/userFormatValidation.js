const Joi = require("@hapi/joi");

module.exports = {
  registerUser: (user) => {
    const schema = Joi.object({
      name: Joi.string().min(6).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });
    return schema.validate(user);
  },

  validUser: () => {
    const schema = Joi.object({
      name: Joi.string().min(6).required(),
      password: Joi.string().min(6).required(),
    });
    return schema.validate(data);
  },
};
