const functions = require("firebase-functions");

const router = require("express").Router(); // eslint-disable-line

router.get("/", (request, response) => {
  functions.logger.info("Keeping it hot");
  response.status(200).send("Keeping it hot");
  return;
});

module.exports = router;
