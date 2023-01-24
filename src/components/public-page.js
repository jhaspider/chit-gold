import React from "react";
import { Link } from "react-router-dom";

const PublicPage = () => {
  return (
    <div className="public-page">
      <div className="public-left">
        <h1>
          Crux of the story <br />
          in the form of cheats
        </h1>
        <Link to="console">Author a Cheat Sheet</Link>
      </div>
      <div className="public-right">
        <h2>
          Top Cheat Sheets <br />
          Authored by not so genuises
        </h2>
        <div className="cheat-sheet">
          <Link to="console/topic/mUPwtcQBR71alh8NvLO0">mUPwtcQBR71alh8NvLO0</Link>
        </div>
        <div className="cheat-sheet"></div>
        <div className="cheat-sheet"></div>
      </div>
    </div>
  );
};

export default PublicPage;
