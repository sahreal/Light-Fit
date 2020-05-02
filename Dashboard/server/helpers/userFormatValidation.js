const Joi = require("@hapi/joi");

module.exports = {
  registerUser: user => {
    const schema = Joi.object({
      user: Joi.string()
        .min(6)
        .required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string()
        .min(6)
        .required()
    });
    return schema.validate(user);
  },

  validUser: data => {
    const schema = Joi.object({
      //email: Joi.string().email().required(),
      password: Joi.string()
        .min(6)
        .required()
    });
    return schema.validate(data);
  }
};
