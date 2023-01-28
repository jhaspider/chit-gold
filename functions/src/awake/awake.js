const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");

const requests = require("./requests");

// eslint-escape
const corsOptions = {
  origin: true,
};

const app = express();
app.use(cors(corsOptions));
app.use("/", requests);
const runtimeOpts = {
  memory: "1GB",
  maxInstances: 1,
};

exports.awake = functions.runWith(runtimeOpts).region("asia-south1").https.onRequest(app);
