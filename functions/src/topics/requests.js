const functions = require("firebase-functions");
const admin = require("firebase-admin");
const router = require("express").Router(); // eslint-disable-line
const db = admin.firestore();

const { validateUser } = require("../utils/session");
const { TOPICS, CHITS } = require("../utils/collections");
const { err } = require("../utils/helpers");

const { X_SESSION_ID, LIMIT_TOPIC } = require("../utils/constants");

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

  const type = request.query["type"];

  const user_terms = await db.collection(TOPICS);

  let query = user_terms.limit(LIMIT_TOPIC);
  try {
    if (type === "user") query = user_terms.where("uid", "==", sessionId).orderBy("createdAt", "asc");
    if (type === "public") query = user_terms.where("mode", "==", "public").where("cloned", "==", false).orderBy("createdAt", "desc");
    const snapshot = await query.get();

    if (snapshot.empty) {
      functions.logger.info(`Topics: 0, ${type}`);
      response.status(200).send({ status: false, msg: "No topics found" });
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
      functions.logger.info(`Topics: ${data.length}, ${type}`);
      response.status(200).send({
        status: true,
        topics: data,
      });
      return;
    }
  } catch (e) {
    functions.logger.error(`Topics: ${e}`);
    response.status(500).send(err.internal_error);
    return;
  }
  return;
});

router.get(`/topics/:id`, async (request, response) => {
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

  try {
    const topicId = request.params.id;

    const topicDoc = await db.collection(TOPICS).doc(topicId).get();
    if (!topicDoc.exists) {
      functions.logger.error(`Topic: ${topicId} not found`);
      response.status(400).send({
        status: false,
        msg: `Topic: ${topicId} not found`,
      });
      return;
    } else {
      const topic = topicDoc.data();
      if (topic.mode === "private" && topic.uid !== sessionId) {
        response.status(400).send(err.not_authorised_topic);
        return;
      }
      functions.logger.info(`Topic: ${topicId} found`);
      response.status(200).send({
        status: true,
        topic: {
          ...topic,
          id: topicId,
        },
      });
      return;
    }
  } catch (e) {
    functions.logger.error(`Topic: ${e}`);
    response.status(500).send(err.internal_error);
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

  try {
    const topics_col = await db.collection(TOPICS);
    const topics_col_doc_ref = topics_col.doc();
    const data = {
      ...topic,
      uid: sessionId,
      cloned: false,
      createdAt: new Date().getTime(),
    };
    await topics_col_doc_ref.set(data);
    const new_topics_id = topics_col_doc_ref.id;

    functions.logger.info(`Topic: ${new_topics_id} added`);
    response.status(200).send({ status: true, new_topics_id });
    return;
  } catch (e) {
    functions.logger.error(`Topic: ${e}`);
    response.status(500).send(err.unknown_error);
    return;
  }
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

  const { id, scale, mode } = topic;

  // Save the topics in db
  try {
    const topicsCol = await db.collection(TOPICS);
    const topicDoc = await topicsCol.doc(id);
    if (scale) topicDoc.update({ scale });
    if (mode) topicDoc.update({ mode });

    functions.logger.info(`Topic: ${id} updated`);
    response.status(200).send({ status: true });
    return;
  } catch (e) {
    functions.logger.error(`Topic: ${e}`);
    response.status(500).send(err.unknown_error);
    return;
  }
});

router.post("/topics/:id/copy", async (request, response) => {
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

  const topicId = request.params.id;
  if (!topicId) {
    response.status(400).send(err.topic_id_missing);
    return;
  }

  try {
    const topicsCol = await db.collection(TOPICS);
    const topicDoc = await topicsCol.doc(topicId);
    const topicData = await topicDoc.get();
    if (!topicData.exists) {
      functions.logger.error(`Topic: ${topicId} not found`);
      response.status(400).send({
        status: false,
        msg: `Topic: ${topicId} not found`,
      });
      return;
    } else {
      const topic = topicData.data();

      // Copy the topic
      const newTopicDoc = await topicsCol.doc();
      const newTopicId = newTopicDoc.id;
      const newTopic = {
        ...topic,
        uid: sessionId,
        id: newTopicId,
        cloned: true,
        createdAt: new Date().getTime(),
      };
      await newTopicDoc.set(newTopic);

      // Copy all the chits of this topic from the CHITS collection
      const chitsCol = await db.collection(CHITS);
      const chitsQuery = await chitsCol.where("topicId", "==", topicId);
      const chitsQuerySnapshot = await chitsQuery.get();
      if (chitsQuerySnapshot.empty) {
        functions.logger.info(`No chits found for topic: ${topicId}`);
      }
      chitsQuerySnapshot.forEach(async (doc) => {
        const chit = doc.data();
        const newChitDoc = await chitsCol.doc();
        const newChitId = newChitDoc.id;
        const data = {
          ...chit,
          topicId: newTopicId,
          uid: sessionId,
          createdAt: new Date().getTime(),
        };
        await newChitDoc.set(data);
      });

      functions.logger.info(`Topic: ${topicId} copied`);
      response.status(200).send({ status: true, topic: newTopic });
      return;
    }
  } catch (e) {
    functions.logger.error(`Topic: ${e}`);
    response.status(500).send(err.internal_error);
    return;
  }

  return;
});

module.exports = router;
