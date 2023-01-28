const functions = require("firebase-functions");
const admin = require("firebase-admin");
const router = require("express").Router(); // eslint-disable-line
const db = admin.firestore();

const { validateUser } = require("../utils/session");
const { USERS } = require("../utils/collections");
const { err } = require("../utils/helpers");

const X_SESSION_ID = "x-cheat-user-id";

/**
 * USER
 * - Userful from chrome extendion
 */
router.post("/register", async (request, response) => {
  if (request.method !== "POST") {
    response.status(400).send(err.post_method_only);
    return;
  }

  const sessionId = request.headers[X_SESSION_ID];

  const uid = request.body["uid"];
  const displayName = request.body["displayName"];
  const email = request.body["email"];
  const metadata = request.body["metadata"];
  const provider = request.body["provider"];

  if (!uid) {
    response.status(400).send(err.session_key_missing);
    return;
  }

  try {
    await validateUser(uid);
  } catch (e) {
    response.status(400).send(err.not_valid_session);
    return;
  }

  // Save the user in db
  const user_ref = await db.collection(USERS);
  const query = user_ref.where("uid", "==", uid);
  const user_snapshot = await query.get();
  if (user_snapshot.empty) {
    const user_col = await db.collection(USERS);
    const user_col_doc_ref = user_col.doc();
    const user = {
      uid,
      displayName,
      created_at: new Date().getTime(),
      email,
      metadata,
      provider,
    };
    await user_col_doc_ref.set(user);
  }

  response.status(200).send("Done");
  return;
});

module.exports = router;
