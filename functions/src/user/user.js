const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
// my routings
const requests = require("./requests");

// eslint-escape
const corsOptions = {
  origin: true,
};

const app = express();
app.use(cors(corsOptions));
app.use("/", requests); // add routes to the express app.

const runtimeOpts = {
  memory: "8GB",
  maxInstances: 10,
};

exports.user = functions.runWith(runtimeOpts).region("asia-south1").https.onRequest(app);