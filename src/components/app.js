import React, { useEffect, useRef, useState } from "react";
import { useChitContext } from "../chit-provider";

import Utils from "../utils/utils";
import Logo from "./logo";
import Sheet from "./sheet";
import SheetMobile from "./sheet-mobile";
import Toolbar from "./Toolbar";
import Topics from "./topics";

import { isMobile } from "react-device-detect";
import Events from "../utils/events";
import TopicsMobile from "./topics-mobile";
import UserCompMobile from "./user-comp-mobile";

const TAG = "App - ";

function App() {
  const { user } = useChitContext();
  if (!user) return null;

  if (isMobile) return <MobileScreen />;
  else return <LargeScreen />;
}

/**
 * On screen above 768px
 * @returns LargeScreen
 */
function LargeScreen() {
  return (
    <>
      <Logo />
      <Topics />
      <Sheet />
      <Toolbar />
    </>
  );
}

/**
 * On screen below 768px
 * @returns MobileScreen
 */
function MobileScreen() {
  const sheet_mobile_ref = useRef(null);
  const [selected_topic, setSelectedTopic] = useState(null);

  useEffect(() => {
    document.addEventListener(Events.TOPIC_SELECT, onTopicSelect);
    document.addEventListener(Events.TOGGLE_BG, onToggleBg);
    return () => {
      document.removeEventListener(Events.TOPIC_SELECT, onTopicSelect);
      document.removeEventListener(Events.TOGGLE_BG, onToggleBg);
    };
  }, []);

  const onTopicSelect = (e) => {
    setSelectedTopic(e.detail.topic);
  };

  const onToggleBg = () => {
    sheet_mobile_ref.current.classList.toggle("blur");
  };

  return (
    <>
      <div className="mobile-root" ref={sheet_mobile_ref}>
        <div className="mobile-header">
          <UserCompMobile />
          {selected_topic && <h1>Git Essential Commands</h1>}
        </div>
        <SheetMobile />
        <h1 className="logo">ChitGold</h1>
      </div>

      <div className="mobile-bottom-container">
        <TopicsMobile />
      </div>
      {/* <Toolbar /> */}
    </>
  );
}

export default App;
