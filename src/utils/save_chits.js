function SaveChits(all_chits) {
  const props = [];
  all_chits.forEach((chit) => {
    props.push(chit.props);
  });
  localStorage.setItem("chits", JSON.stringify(props));
}

function LoadChits() {
  const data = localStorage.getItem("chits");
  const chits = JSON.parse(data);
  if (chits) {
    const filtered_chits = chits.filter((chit) => !chit.archive);
    return filtered_chits;
  }
}

function archiveChit(all_chits, id) {
  all_chits.find((chit) => {
    if (chit.props.id === id) {
      chit.props = {
        ...chit.props,
        archive: chit.props.archive ? false : true,
      };
      return chit;
    }
  });

  SaveChits(all_chits);
}

function AddTopic(topic) {
  const data = localStorage.getItem("topics");
  let topics = [];
  if (data) {
    topics = JSON.parse(data);
  }
  topics = [topic, ...topics];
  localStorage.setItem("topics", JSON.stringify(topics));
}

export { SaveChits, LoadChits, archiveChit, AddTopic };
