import axios from "../utils/axios";
import EndPoints from "./endpoints";

function Register(currentUser) {
  const data = {
    uid: currentUser.uid,
    displayName: currentUser.displayName,
    email: currentUser.email,
    metadata: currentUser.metadata,
    provider: currentUser.providerData.length > 0 ? currentUser.providerData[0] : null,
  };
  axios({
    method: "post",
    url: EndPoints.REGISTER,
    data,
  }).then(function (response) {});
}

async function AddChit(chit) {
  return axios({
    method: "post",
    url: EndPoints.CHITS_ADD,
    data: {
      chit,
    },
  }).then(function (response) {
    return response.data.new_chit_id;
  });
}

function UpdateAllChits(updateChits) {
  return axios({
    method: "post",
    url: EndPoints.CHITS_UPDATE_ALL,
    data: {
      all_chits: updateChits,
    },
  }).then(function (response) {
    return response;
  });
}

function UpdateChit(chitId, chit) {
  return axios({
    method: "put",
    url: EndPoints.CHITS_UPDATE,
    data: {
      chitId,
      chit,
    },
  }).then(function (response) {
    return response;
  });
}

async function LoadChits(topicId) {
  return axios({
    method: "get",
    url: EndPoints.CHITS,
    params: {
      topicId,
    },
  }).then(function (response) {
    return response.data.chits;
  });
}

async function AddTopic(topic) {
  return axios({
    method: "post",
    url: EndPoints.TOPICS_ADD,
    data: {
      topic,
    },
  }).then(function (response) {
    const { new_topics_id } = response.data;
    return new_topics_id;
  });
}

async function LoadTopicDetails(topicId) {
  const endpoint = EndPoints.TOPICS_BY_ID(topicId);
  return axios({
    method: "get",
    url: endpoint,
  }).then(function (response) {
    return response.data;
  });
}

function UpdateTopic(topic) {
  return axios({
    method: "put",
    url: EndPoints.TOPICS_UPDATE,
    data: {
      topic,
    },
  }).then(function (response) {
    return response;
  });
}

async function LoadTopics() {
  return axios({
    method: "get",
    url: EndPoints.TOPICS,
  }).then(function (response) {
    const { status, topics } = response.data;
    return status ? topics : [];
  });
}

export { Register, AddChit, LoadChits, UpdateChit, UpdateAllChits, AddTopic, LoadTopics, UpdateTopic, LoadTopicDetails };
