const EndPoints = {
  REGISTER: "apis-user-user/register",
  TOPICS: "apis-topics-topics/topics",
  TOPICS_ADD: "apis-topics-topics/topics/add",
  TOPICS_UPDATE: "apis-topics-topics/topics/update",
  TOPICS_BY_ID: (topic_id) => `apis-topics-topics/topics/${topic_id}`,
  COPY_TOPICS_BY_ID: (topic_id) => `apis-topics-topics/topics/${topic_id}/copy`,
  CHITS: "apis-chits-chits/chits",
  CHITS_ADD: "apis-chits-chits/chits/add",
  CHITS_UPDATE_ALL: "apis-chits-chits/chits/update_all",
  CHITS_UPDATE: "apis-chits-chits/chits/update",
};
export default EndPoints;
