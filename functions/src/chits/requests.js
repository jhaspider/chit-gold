const functions = require("firebase-functions");
const admin = require("firebase-admin");
const router = require("express").Router(); // eslint-disable-line
const db = admin.firestore();

const { validateUser } = require("../utils/session");
const { TOPICS, CHITS } = require("../utils/collections");
const { err } = require("../utils/helpers");

const X_SESSION_ID = require("../utils/constants").X_SESSION_ID;

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

  const topicId = request.query["topicId"];

  // Check if the chit is not private and the owner is not the current user
  const topicCol = await db.collection(TOPICS).doc(topicId).get();
  if (!topicCol.exists) {
    response.status(400).send(err.not_valid_topic);
    return;
  } else {
    const topic = topicCol.data();
    if (topic.mode === "private" && topic.uid !== sessionId) {
      response.status(400).send(err.not_authorised_topic);
      return;
    }
  }

  // Load and return all the chits
  const user_terms = await db.collection(CHITS);
  let query = user_terms.where("topicId", "==", topicId).where("archive", "==", false);
  const snapshot = await query.get();
  if (snapshot.empty) {
    functions.logger.info(`Chits: 0 returned for topic_id : ${topicId}`);
    response.status(200).send({ status: false, msg: "No chits found" });
    return;
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

    functions.logger.info(`Chits: ${data.length}, Topic Id : ${topicId}`);
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
  try {
    let new_chit_id;
    try {
      const topics_col = await db.collection(CHITS);
      const topics_col_doc_ref = topics_col.doc();
      const data = {
        ...chit,
        uid: sessionId,
      };
      await topics_col_doc_ref.set(data);
      new_chit_id = topics_col_doc_ref.id;
    } catch (e) {
      functions.logger.error(e);
      response.status(500).send(err.unknown_error);
      return;
    }

    // Update chit count in the topic collection for the topic id
    try {
      if (new_chit_id) {
        const { topicId } = chit;
        const topicsCol = await db.collection(TOPICS);
        const topicDoc = await topicsCol.doc(topicId);
        const topicData = await topicDoc.get();
        if (topicData.exists) {
          let { count } = topicData.data();
          count = count ? count + 1 : 1;
          topicDoc.update({ count });
          functions.logger.info(`Topic Id count updated: ${topicId}`);
        }
      }
    } catch (e) {
      functions.logger.error(e, `Chit saved, but topic: ${topicId} count could not be updated.`);
    }

    if (new_chit_id) {
      functions.logger.info(`Chit added: ${new_chit_id}`);
      response.status(200).send({ status: true, new_chit_id });
      return;
    } else {
      functions.logger.info(`Chit not added`);
      response.status(200).send({ status: false, new_chit_id: null });
      return;
    }
  } catch (e) {
    functions.logger.error(e);
    response.status(500).send(err.not_valid_session);
    return;
  }
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

  try {
    const batch = db.batch();
    const chits_col = await db.collection(CHITS);
    all_chits.forEach((chit) => {
      const chitDocRef = chits_col.doc(chit.chitId);
      batch.update(chitDocRef, chit.props);
    });
    await batch.commit();

    functions.logger.info(`Chits updated: ${all_chits.length}`);
    response.status(200).send({ status: true });
    return;
  } catch (e) {
    functions.logger.error(e);
    response.status(500).send(err.unknown_error);
    return;
  }
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

  const chit = request.body["chit"];
  if (!chit) {
    response.status(400).send(err.session_key_missing);
    return;
  }

  // Save the topics in db
  try {
    const chitDoc = await db.collection(CHITS).doc(chit.id);
    chitDoc.update({ ...chit });

    functions.logger.info(`Chit updated: ${chit.id}`);
    response.status(200).send({ status: true });
    return;
  } catch (e) {
    functions.logger.error(e);
    response.status(500).send(err.unknown_error);
    return;
  }
});

module.exports = router;
