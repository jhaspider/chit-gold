import { useChitContext } from "../chit-provider";
import axios from "../utils/axios";
import EndPoints from "./endpoints";

// Custom hook to manage api calls
export function useApi() {
  const { setError, setSpinner } = useChitContext();

  async function Register(currentUser) {
    const data = {
      uid: currentUser.uid,
      displayName: currentUser.displayName,
      email: currentUser.email,
      metadata: currentUser.metadata,
      provider: currentUser.providerData.length > 0 ? currentUser.providerData[0] : null,
    };

    setSpinner(true);
    return axios({
      method: "post",
      url: EndPoints.REGISTER,
      data,
    })
      .then(function (response) {
        const { status } = response.data;
        return status;
      })
      .catch((err) => {
        const { status, msg } = err.response.data;
        setError(msg);
        return status;
      })
      .finally(() => {
        setSpinner(false);
      });
  }

  async function CopyTopic(topicId) {
    const endpoint = EndPoints.COPY_TOPICS_BY_ID(topicId);
    setSpinner(true);
    return axios({
      method: "post",
      url: endpoint,
    })
      .then(function (response) {
        const { status, topic } = response.data;
        return status ? topic : null;
      })
      .catch((err) => {
        const { status, msg } = err.response.data;
        setError(msg);
        return null;
      })
      .finally(() => {
        setSpinner(false);
      });
  }

  async function AddChit(chit) {
    return axios({
      method: "post",
      url: EndPoints.CHITS_ADD,
      data: {
        chit,
      },
    })
      .then(function (response) {
        const { status, new_chit_id } = response.data;
        return status ? new_chit_id : null;
      })
      .catch((err) => {
        const { status, msg } = err.response.data;
        setError(msg);
        return null;
      })
      .finally(() => {});
  }

  async function UpdateAllChits(updateChits) {
    return axios({
      method: "post",
      url: EndPoints.CHITS_UPDATE_ALL,
      data: {
        all_chits: updateChits,
      },
    })
      .then(function (response) {
        const { status } = response.data;
        return status;
      })
      .catch((err) => {
        const { status, msg } = err.response.data;
        return status;
      })
      .finally(() => {});
  }

  async function UpdateChit(chit) {
    return axios({
      method: "put",
      url: EndPoints.CHITS_UPDATE,
      data: {
        chit,
      },
    })
      .then(function (response) {
        const { status } = response.data;
        return status;
      })
      .catch((err) => {
        const { status, msg } = err.response.data;
        return status;
      })
      .finally(() => {});
  }

  async function LoadChits(topicId) {
    setSpinner(true);
    return axios({
      method: "get",
      url: EndPoints.CHITS,
      params: {
        topicId,
      },
    })
      .then(function (response) {
        const { status, chits } = response.data;
        return status ? chits : [];
      })
      .catch((err) => {
        const { status, msg } = err.response.data;
        setError(msg);
        return null;
      })
      .finally(() => {
        setSpinner(false);
      });
  }

  async function AddTopic(topic) {
    return axios({
      method: "post",
      url: EndPoints.TOPICS_ADD,
      data: {
        topic,
      },
    })
      .then(function (response) {
        const { status, new_topics_id } = response.data;
        return status ? new_topics_id : null;
      })
      .catch((err) => {
        const { status, msg } = err.response.data;
        setError(msg);
        return null;
      })
      .finally(() => {});
  }

  async function LoadTopicDetails(topicId) {
    const endpoint = EndPoints.TOPICS_BY_ID(topicId);
    return axios({
      method: "get",
      url: endpoint,
    })
      .then(function (response) {
        const { status, topic } = response.data;
        return status ? topic : null;
      })
      .catch((err) => {
        const { status, msg } = err.response.data;
        setError(msg);
        return null;
      });
  }

  async function UpdateTopic(topic) {
    return axios({
      method: "put",
      url: EndPoints.TOPICS_UPDATE,
      data: {
        topic,
      },
    })
      .then(function (response) {
        const { status } = response.data;
        return status;
      })
      .catch((err) => {
        const { status, msg } = err.response.data;
        return status;
      })
      .finally(() => {});
  }

  async function LoadTopics(type = "user") {
    setSpinner(true);
    return axios({
      method: "get",
      url: EndPoints.TOPICS,
      params: {
        type,
      },
    })
      .then(function (response) {
        const { status, topics } = response.data;
        return status ? topics : [];
      })
      .catch((err) => {
        const { status, msg } = err.response.data;
        return null;
      })
      .finally(() => {
        setSpinner(false);
      });
  }

  return { Register, AddChit, LoadChits, UpdateChit, UpdateAllChits, AddTopic, LoadTopics, UpdateTopic, LoadTopicDetails, CopyTopic };
}

export default useApi;
