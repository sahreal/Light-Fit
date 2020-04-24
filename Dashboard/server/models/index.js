// const { Morning, Afternoon, MidDay, Evening } = require("../../db/index");
// var MongoClient = require("mongodb").MongoClient;
// assert = require("assert");
// const uri = require("../../config/key").mongoURI;

// var options = {
//   server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
//   replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
// };

// const client = new MongoClient(uri, options);

// module.exports = {
//   time: {
//     get: function(callback) {
//       client.connect((err, client) => {
//         if (err) console.log(err, "failed to connect");
//         else {
//           console.log("connected");
//           const collection = client.db("SlackApp").collection("Afternoon");
//           collection.find(null, async (err, result) => {
//             try {
//               let temp = await result.toArray();
//               callback(null, temp);
//               return client.close();
//             } catch (err) {
//               console.log(err, "Get promise error");
//             }
//           });
//         }
//       });
//     },
//     post: function(req, callback) {
//       let result = req.body;
//       client.connect(async (err, client) => {
//         if (err) console.log(err, "failed to connect");
//         else {
//           try {
//             console.log("connected");
//             const collection = client.db("SlackApp").collection("Afternoon");
//             await collection.insertOne(result);
//             callback(null);
//             return client.close();
//           } catch (err) {
//             console.log(err, "post promise error");
//           }
//         }
//       });
//     },
//     put: function(req, callback) {
//       let result = req.body;
//       console.log(result, "REQ>BODY PUT1111");
//       client.connect((err, client) => {
//         if (err) console.log(err, "failed to connect");
//         else {
//           console.log("connected");
//           const collection = client.db("SlackApp").collection("Afternoon");

//           collection.findOneAndReplace(
//             { Prompt: req.body.oldPrompt },
//             {
//               Prompt: req.body.Prompt,
//               Time: req.body.Time
//             },
//             async (err, result) => {
//               let temp = await result;
//               callback(null, temp);
//               return client.close();
//             }
//           );
//         }
//       });
//     },
//     delete: function(req, callback) {
//       let result = req.body;
//       client.connect(async (err, client) => {
//         if (err) console.log(err, "failed to connect");
//         else {
//           try {
//             console.log("connected");
//             const collection = client.db("SlackApp").collection("Afternoon");
//             await collection.deleteOne(result);
//             callback(null);
//             return client.close();
//           } catch (err) {
//             console.log(err, "delete promise error");
//           }
//         }
//       });
//     }
//   }
// };
