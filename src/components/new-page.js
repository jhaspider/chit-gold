import React from "react";
import { Navigate } from "react-router-dom";
import { useChitContext } from "../chit-provider";

function NewPage() {
  const { user } = useChitContext();

  if (user && !user.isAnonymous) {
    return <Navigate to="/console" replace={true} />;
  }

  return (
    <div className="new-page">
      <div className="container">
        <h1>
          <span>ChitGold</span>
        </h1>

        <div className="divider vert" />
        <div className="waitlist">
          <h2>
            Discover the power of condensed information with this unique content publishing platform.
            <br />
            <br />
            <br />
            Easily share and access compact, easy-to-read summaries on a variety of subjects and topics.
            <br />
            <br />
            <br />
            With a focus on clarity and brevity, this platform is the ultimate tool for retaining and recalling important information.
          </h2>
        </div>

        <div className="divider vert" />

        <div className="public-intro">
          <p>
            Join our exclusive private beta!
            <br />
            Fill out your information and we'll keep you updated on opportunities to become a featured author on our platform.
          </p>
          <a href="https://forms.gle/nDaRoCAJV9ciebTS7" className="primary-button">
            GET ON THE WAITLIST
          </a>
        </div>

        <div className="divider vert" />
      </div>

      <div className="public-footer">
        <p>Version : 1.0.0-beta</p>
        <div className="content">
          <p>"The content on this website is for general informational purposes only and is not intended to be a substitute for professional advice, diagnosis, or treatment. </p>

          <p>Any opinions expressed on this website are solely those of the authors and do not necessarily reflect the views of the website or its owners. </p>
          <p>
            The website and its owners make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability or availability with respect to
            the website or the information, products, services, or related graphics contained on the website for any purpose.
          </p>
          <p>Any reliance you place on such information is therefore strictly at your own risk.</p>
        </div>
      </div>
    </div>
  );
}

export default NewPage;
