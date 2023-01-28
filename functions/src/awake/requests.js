const functions = require("firebase-functions");

const router = require("express").Router(); // eslint-disable-line

router.get("/", (_, response) => {
  functions.logger.info("Keeping it hot");
  response.status(200).send({ status: true, msg: "Keeping it hot" });
  return;
});

module.exports = router;
