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
  memory: "4GB",
  maxInstances: 10,
  minInstances: 0,
};

exports.topics = functions.runWith(runtimeOpts).region("asia-south1").https.onRequest(app);
