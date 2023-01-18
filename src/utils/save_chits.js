function SaveChits(all_chits) {
  const props = [];
  all_chits.forEach((chit) => {
    props.push(chit.props);
  });
  localStorage.setItem("chits", JSON.stringify(props));
}

function AddChit(chit) {
  const data = localStorage.getItem("chits");
  let chits = [];
  if (data) {
    chits = JSON.parse(data);
  }
  chits = [...chits, chit];
  localStorage.setItem("chits", JSON.stringify(chits));
}

function UpdateChit(new_chit) {
  const data = localStorage.getItem("chits");
  let chits = [];
  if (data) {
    chits = JSON.parse(data);
  }
  let chitIndex = chits.findIndex((chit) => chit.id === new_chit.id);
  if (chitIndex >= 0) {
    let chit = chits[chitIndex];
    chit = {
      ...chit,
      ...new_chit,
    };
    chits[chitIndex] = chit;
    localStorage.setItem("chits", JSON.stringify(chits));
  }
}

function LoadChits(topicId) {
  const data = localStorage.getItem("chits");
  const chits = JSON.parse(data);
  if (chits) {
    const filtered_chits = chits.filter((chit) => !chit.archive && chit.topicId == topicId);
    return filtered_chits;
  }
}

function archiveChit(id) {
  const data = localStorage.getItem("chits");
  let chits = [];
  if (data) {
    chits = JSON.parse(data);
  }
  let chitIndex = chits.findIndex((chit) => chit.id === id);
  if (chitIndex >= 0) {
    let chit = chits[chitIndex];
    chit = {
      ...chit,
      archive: chit.archive ? false : true,
    };
    chits[chitIndex] = chit;
    localStorage.setItem("chits", JSON.stringify(chits));
  }
}

function AddTopic(topic) {
  const data = localStorage.getItem("topics");
  let topics = [];
  if (data) {
    topics = JSON.parse(data);
  }
  topics = [...topics, topic];
  localStorage.setItem("topics", JSON.stringify(topics));
}

function UpdateTopic(update_topic) {
  const data = localStorage.getItem("topics");
  let topics = [];
  if (data) {
    topics = JSON.parse(data);
  }
  let tpIndex = topics.findIndex((topic) => topic.id === update_topic.id);
  if (tpIndex >= 0) {
    let topic = topics[tpIndex];
    topic = {
      ...topic,
      scale: update_topic.scale,
    };
    topics[tpIndex] = topic;
    localStorage.setItem("topics", JSON.stringify(topics));
  }
}

function LoadTopics() {
  const data = localStorage.getItem("topics");
  let topics = [];
  if (data) {
    topics = JSON.parse(data);
  }
  return topics;
}

export { AddChit, LoadChits, UpdateChit, archiveChit, AddTopic, LoadTopics, UpdateTopic };
