import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useChitContext } from "../chit-provider";
import useFirebaseLogin from "../firebase-login";
import { LoadTopics } from "../utils/save_chits";
import Logo from "./logo";

const Intro = () => {
  const { login } = useFirebaseLogin();

  const onLoginTap = (e) => {
    e.preventDefault();
    login();
  };
  return (
    <div className="public-intro">
      <h1>
        Crux of the story <br />
        in the form of chits
      </h1>
      <Link to="console" className="primary-button">
        Author a chit sheet
      </Link>
      <Link to="" onClick={onLoginTap}>
        Take me to my board
      </Link>
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
        Authored by not so geniuses
      </h2>
      <div className="topics-container">
        {all_topics.map((topic, ind) => {
          return (
            <div key={`topic-${ind}`} className="cheat-sheet">
              <h3>{topic.topicName}</h3>
              <div>
                {topic.count > 0 && <p>{topic.count} chits</p>}
                <Link to={`console/topic/${topic.id}`}>Take a peek</Link>
              </div>
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
      <h2>What is ChitGold?</h2>
      <div className="content">
        ChitGold is a unique content publishing platform that allows users to share and discover quick notes, also known as "chits." These chits can include a wide range of information. Whether you're
        looking to share your own knowledge with others or discover new information. Every chit is gold.
        <br />
        <br />
        You may have one of the following plausible use cases to author the chits
        <ul>
          <li>You just read a book and want to note down the excerpts and share the key findings</li>
          <li>Write the key terminal commands that is useful for Git operations</li>
          <li>Doing an online course? You might want to write down the key learnings</li>
          <li>Setup a birthday wishes wall</li>
          <li>Write farewell wishes for the out-going collegue</li>
          <li>Explain the key finding of public policies</li>
          <li>Write the options available for tax exemption and investments </li>
        </ul>
        <br />
        Give it a try. Author your first chit sheet.
        <div className="link-container">
          <Link to="console" className="primary-button">
            Author a chit sheet
          </Link>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <div className="public-footer">
      <div className="content">
        <p>Version : 1.0.0</p>
        <p>
          "The content on this website is for general informational purposes only and is not intended to be a substitute for professional advice, diagnosis, or treatment. Any opinions expressed on
          this website are solely those of the authors and do not necessarily reflect the views of the website or its owners. The website and its owners make no representations or warranties of any
          kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to the website or the information, products, services, or related graphics
          contained on the website for any purpose. Any reliance you place on such information is therefore strictly at your own risk."
        </p>
      </div>
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
      <Logo />
      <div id="topics-list">
        <p></p>
      </div>
      <Intro />
      {user && <PublicChits />}
      <FAQs />
      <Footer />
    </div>
  );
};

export default PublicPage;
