const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

admin.initializeApp();

const app = express();

// eslint-escape
const corsOptions = {
  origin: true,
};

app.use(cors(corsOptions));

const awake = require("./src/awake/awake");
const user = require("./src/user/user");
const topics = require("./src/topics/topics");
const chits = require("./src/chits/chits");
//
//
exports.apis = {
  awake,
  user,
  topics,
  chits,
};
