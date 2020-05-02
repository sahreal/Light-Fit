const mongoose = require("mongoose");
const uri = require("../../config/key").mongoURI;
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));
const {
  Morning,
  Afternoon,
  MidDay,
  Evening,
  tokenCounts,
  users
} = require("../../db/index");
const { createToken } = require("../helpers/tokenVerification.js");
const validate = require("../helpers/userFormatValidation.js");
const { encrypt, decrypt } = require("../helpers/encryption.js");

const timeOfDay = {
  Morning: Morning,
  MidDay: MidDay,
  Afternoon: Afternoon,
  Evening: Evening
};

module.exports = {
  command: {
    getAll: (req, res) => {
      let time = req.query.timeOfDay;
      timeOfDay[time].collection.find(null, async function(err, results) {
        if (err) {
          return console.error(err);
        } else {
          try {
            let temp = await results.toArray();
            res.send(temp).status(201);
          } catch (err) {
            console.log(err, "Get promise error");
          }
        }
      });
    },
    postOne: async (req, res) => {
      let time = req.body.timeOfDay;
      let result = {
        Prompt: req.body.input,
        Time: time,
        Sent: false,
        LastSent: null
      };
      try {
        await timeOfDay[time].collection.insertOne(result);
        res.sendStatus(200);
      } catch (err) {
        console.log(err, "update post error");
      }
    },
    update: (req, res) => {
      let request = req.body;
      console.log(request, "request");
      let time = req.body.Time;

      timeOfDay[time].collection.findOneAndReplace(
        { Prompt: request.oldPrompt },
        {
          Prompt: request.Prompt,
          Time: request.Time,
          Sent: false,
          LastSent: null
        },
        async (err, result) => {
          try {
            await result.value;
            res.sendStatus(200);
          } catch (err) {
            console.log(err, "update promise error");
          }
        }
      );
    },
    deleteOne: async (req, res) => {
      let result = req.body;
      let time = req.body.Time;
      try {
        await timeOfDay[time].collection.deleteOne(result);
        res.sendStatus(200);
      } catch (err) {
        console.log(err, "delete promise error");
      }
    },
    countTokens: async (req, res) => {
      let count = await tokenCounts.find({});
      count = { count: count[0].count };
      res.status(200).send(count);
    },
    recentlySent: async (req, res) => {
      const recentMessages = {};
      try {
        for (let collection in timeOfDay) {
          recentMessages[collection] = await timeOfDay[
            collection
          ].collection.find({ Sent: true }, { $limit: 5 });
        }
        res.status(200).send(recentMessages);
      } catch (err) {
        console.log("ERROR: ", err);
        res.sendStatus(500);
      }
    },
    addUser: async (req, res) => {
      // Use Joi to validate user format meets criteria
      const isValid = validate.registerUser(req.body);
      if (isValid.error)
        return res.status(400).send(isValid.error.details[0].message);

      // Checks if user exists
      const userExists = await users.findOne({ email: req.body.email });
      if (userExists) return res.status(400).send("User Already Exists");

      const user = {
        user_name: req.body.user,
        email: req.body.email,
        password: await encrypt(req.body.password)
      };

      // Insert the user into the DB
      try {
        await users.insertMany([user]);
        return res.status(201).send("Successful");
      } catch (err) {
        res.status(400).send(err);
      }
    },
    login: async (req, res) => {
      // validates the user request format
      const isValid = validate.validUser(req.body);
      if (isValid.error)
        return res.status(400).send(isValid.error.details[0].message);

      // validates if the user exists
      const userExists = await users.find();
      console.log(userExists, "USer");
      if (!userExists)
        return res.status(400).send("Username or Password is wrong");

      // validates thes password with bcrypt
      const isValidPassword = await decrypt(
        req.body.password,
        userExists[0].password
      );
      if (!isValidPassword)
        return res.status(400).send("Username or Password is wrong");

      // creates the token and sets it in the cookie. Expires in an hr
      const token = createToken(userExists._id);
      res
        .status(200)
        .cookie("ww-token", token, { httpOnly: true, maxAge: 3600000 })
        .send({ loggedIn: true });
    },
    logout: (req, res) => {
      res.clearCookie("ww-token");
      res.status(200).send({ loggedOut: true });
    }
  }
};
