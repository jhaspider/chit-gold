import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useChitContext } from "../chit-provider";
import { LoadTopics } from "../utils/save_chits";

const Intro = () => {
  return (
    <div className="public-intro">
      <h1>
        Crux of the story <br />
        in the form of chits
      </h1>
      <Link to="console" className="primary">
        Author a sheet
      </Link>
      <Link to="console">Take me to my board</Link>
    </div>
  );
};

const PublicChits = () => {
  const [all_topics, setAllTopics] = useState([]);
  const colors = ["FBF8CC", "FDE4CF", "FFCFD2", "F1C0E8", "CFBAF0", "A3C4F3", "90DBF4", "8EECF5", "98F5E1", "B9FBC0"];

  useEffect(() => {
    (async () => {
      await loadAllTopics();
    })();
  }, []);

  const loadAllTopics = async () => {
    const topics = await LoadTopics("public");
    setAllTopics((_) => [...topics]);
  };

  return (
    <div className="public-topics">
      <h2>
        Top Chits <br />
        Authored by not so genuises
      </h2>
      <div className="topics-container">
        {all_topics.map((topic, ind) => {
          return (
            <div key={`topic-${ind}`} className="cheat-sheet" style={{ backgroundColor: colors[ind] }}>
              <h3>{topic.topicName}</h3>
              <Link to={`console/topic/${topic.id}`}>Take a peek</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FAQs = () => {
  return (
    <div className="public-faqs">
      <h2>
        Frequently Asked Questions <br />
      </h2>
      <div className="topics-container"></div>
    </div>
  );
};

const Footer = () => {
  return (
    <div className="public-footer">
      <ul>
        <li>Option 1</li>
        <li>Option 2</li>
        <li>Option 3</li>
        <li>Option 4</li>
        <li>Option 5</li>
      </ul>
    </div>
  );
};

const PublicPage = () => {
  const { user } = useChitContext();

  if (user && !user.isAnonymous) {
    return <Navigate to="/console" replace={true} />;
  }

  return (
    <div className="public-page">
      <Intro />
      {user && <PublicChits />}
      <FAQs />
      <Footer />
    </div>
  );
};

export default PublicPage;
