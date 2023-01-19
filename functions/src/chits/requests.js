const functions = require("firebase-functions");
const admin = require("firebase-admin");
const router = require("express").Router(); // eslint-disable-line
const db = admin.firestore();

const { validateUser, deleteUser } = require("../utils/session");
const { TOPICS, CHITS } = require("../utils/collections");
const { err } = require("../utils/helpers");

const X_SESSION_ID = "x-cheat-user-id";

router.get("/chits", async (request, response) => {
  if (request.method !== "GET") {
    response.status(400).send(err.post_method_only);
    return;
  }

  const sessionId = request.headers[X_SESSION_ID];
  try {
    await validateUser(sessionId);
  } catch (e) {
    response.status(400).send(err.not_valid_session);
    return;
  }

  // const topicId = request.params.topicId;
  const topicId = request.query["topicId"];
  console.log(`Topic Id : ${topicId}`);

  const user_terms = await db.collection(CHITS);
  let query = user_terms.where("uid", "==", sessionId).where("topicId", "==", topicId).where("archive", "==", false);
  const snapshot = await query.get();
  if (snapshot.empty) {
    response.status(200).send({ status: false });
  } else {
    const data = [];
    snapshot.forEach((doc) => {
      const id = doc.id;
      const topic = {
        ...doc.data(),
        id,
      };
      data.push(topic);
    });

    // Pagination flag
    // const lastVisible = snapshot.docs[snapshot.docs.length - 1];
    // const nextSnap = await user_terms.where("uid", "==", sessionId).where("term", ">=", alphabet).where("term", "<", next_alphabet).orderBy("term").startAfter(lastVisible).limit(1).get();

    // let nextFlag;
    // if (!nextSnap.empty) {
    //   const doc = nextSnap.docs[0];
    //   nextFlag = doc.id;
    // }

    response.status(200).send({
      status: true,
      chits: data,
    });
    return;
  }

  return;
});

router.post("/chits/add", async (request, response) => {
  if (request.method !== "POST") {
    response.status(400).send(err.post_method_only);
    return;
  }

  const sessionId = request.headers[X_SESSION_ID];
  if (!sessionId) {
    response.status(400).send(err.session_key_missing);
    return;
  }

  try {
    await validateUser(sessionId);
  } catch (e) {
    response.status(400).send(err.not_valid_session);
    return;
  }

  const chit = request.body["chit"];
  if (!chit) {
    response.status(400).send(err.session_key_missing);
    return;
  }
  // Save the topics in db

  const topics_col = await db.collection(CHITS);
  const topics_col_doc_ref = topics_col.doc();
  const data = {
    ...chit,
    uid: sessionId,
  };
  await topics_col_doc_ref.set(data);
  const new_chit_id = topics_col_doc_ref.id;

  response.status(200).send({ new_chit_id });
  return;
});

router.post("/chits/update_all", async (request, response) => {
  if (request.method !== "POST") {
    response.status(400).send(err.post_method_only);
    return;
  }

  const sessionId = request.headers[X_SESSION_ID];
  if (!sessionId) {
    response.status(400).send(err.session_key_missing);
    return;
  }

  try {
    await validateUser(sessionId);
  } catch (e) {
    response.status(400).send(err.not_valid_session);
    return;
  }

  const all_chits = request.body["all_chits"];
  if (!all_chits) {
    response.status(400).send(err.session_key_missing);
    return;
  }
  // Save the topics in db
  const batch = db.batch();

  const chits_col = await db.collection(CHITS);
  all_chits.forEach((chit) => {
    const chitDocRef = chits_col.doc(chit.chitId);
    batch.update(chitDocRef, chit.props);
  });
  await batch.commit();

  response.status(200).send(true);
  return;
});

router.put("/chits/update", async (request, response) => {
  if (request.method !== "PUT") {
    response.status(400).send(err.post_method_only);
    return;
  }

  const sessionId = request.headers[X_SESSION_ID];
  if (!sessionId) {
    response.status(400).send(err.session_key_missing);
    return;
  }

  try {
    await validateUser(sessionId);
  } catch (e) {
    response.status(400).send(err.not_valid_session);
    return;
  }

  const chitId = request.body["chitId"];
  if (!chitId) {
    response.status(400).send(err.session_key_missing);
    return;
  }

  const chit = request.body["chit"];
  if (!chit) {
    response.status(400).send(err.session_key_missing);
    return;
  }

  // Save the topics in db
  const chitsCol = await db.collection(CHITS);
  const chitDoc = await chitsCol.doc(chitId);
  chitDoc.update({ ...chit });

  response.status(200).send("Update");
  return;
});

module.exports = router;
