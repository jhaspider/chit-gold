import React, { useEffect, useRef, useState } from "react";
import { useChitContext } from "../chit-provider";

import Logo from "./logo";
import Sheet from "./sheet";
import SheetMobile from "./sheet-mobile";
import Toolbar from "./Toolbar";
import Topics from "./topics";
import Utils from "../utils/utils";

import { BrowserView, MobileView, isBrowser, isMobile } from "react-device-detect";
import TopicsMobile from "./topics-mobile";
import Events from "../utils/events";
import UserCompMobile from "./user-comp-mobile";
import { useNavigate } from "react-router-dom";

const TAG = "App - ";
function App() {
  const sheet_mobile_ref = useRef(null);
  const { user } = useChitContext();
  const [selected_topic, setSelectedTopic] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    document.addEventListener(Events.TOPIC_SELECT, onTopicSelect);
    document.addEventListener(Events.TOGGLE_BG, onToggleBg);
    return () => {
      document.removeEventListener(Events.TOPIC_SELECT, onTopicSelect);
      document.removeEventListener(Events.TOGGLE_BG, onToggleBg);
    };
  }, []);

  const logoTap = (e) => {
    if (user.isAnonymous) navigate("/");
  };

  const onTopicSelect = (e) => {
    setSelectedTopic(e.detail.topic);
  };

  const onToggleBg = () => {
    sheet_mobile_ref.current.classList.toggle("blur");
  };

  isMobile = true;
  if (!user) return null;

  if (!isMobile)
    return (
      <>
        <Logo />
        <Topics />
        <Sheet />
        <Toolbar />
      </>
    );
  else {
    return (
      <>
        <div className="mobile-root" ref={sheet_mobile_ref}>
          <div className="mobile-header">
            <UserCompMobile />
            {selected_topic && <h1>{Utils.capitalize(selected_topic.topicName)}</h1>}
          </div>
          <SheetMobile />
          <h1 className="logo">Summize</h1>
        </div>

        <div className="mobile-bottom-container">
          <TopicsMobile />
        </div>
        {/* <Toolbar /> */}
      </>
    );
  }
}

export default App;
