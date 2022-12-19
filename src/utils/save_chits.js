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
  console.log(id);
  all_chits.find((chit) => {
    console.log(chit);
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

export { SaveChits, LoadChits, archiveChit };
