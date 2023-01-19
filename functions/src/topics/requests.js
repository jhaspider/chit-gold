const functions = require("firebase-functions");
const admin = require("firebase-admin");
const router = require("express").Router(); // eslint-disable-line
const db = admin.firestore();

const { validateUser, deleteUser } = require("../utils/session");
const { TOPICS } = require("../utils/collections");
const { err } = require("../utils/helpers");

const X_SESSION_ID = "x-cheat-user-id";

router.get("/topics", async (request, response) => {
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

  const user_terms = await db.collection(TOPICS);
  let query = user_terms.where("uid", "==", sessionId);
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
      topics: data,
    });
    return;
  }

  return;
});

router.post("/topics/add", async (request, response) => {
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

  const topic = request.body["topic"];
  if (!topic) {
    response.status(400).send(err.session_key_missing);
    return;
  }
  // Save the topics in db

  const topics_col = await db.collection(TOPICS);
  const topics_col_doc_ref = topics_col.doc();
  const data = {
    ...topic,
    uid: sessionId,
  };
  await topics_col_doc_ref.set(data);
  const new_topics_id = topics_col_doc_ref.id;

  response.status(200).send({ new_topics_id });
  return;
});

router.put("/topics/update", async (request, response) => {
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

  const topic = request.body["topic"];
  if (!topic) {
    response.status(400).send(err.session_key_missing);
    return;
  }

  const { id, scale } = topic;

  // Save the topics in db
  const topicsCol = await db.collection(TOPICS);
  const topicDoc = await topicsCol.doc(id);
  topicDoc.update({ scale });

  response.status(200).send("Update");
  return;
});
module.exports = router;
