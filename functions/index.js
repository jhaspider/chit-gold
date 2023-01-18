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
//
//
exports.apis = {
  awake,
  user,
};
