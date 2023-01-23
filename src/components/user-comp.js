import React from "react";
import Events from "../utils/events";
import Utils from "../utils/utils";
import axios from "../utils/axios";
import "../firebase";
import { getAuth, GoogleAuthProvider, linkWithPopup, linkWithRedirect, onAuthStateChanged, signInAnonymously, signInWithCredential } from "firebase/auth";
import EndPoints from "../utils/endpoints";
import { Register } from "../utils/save_chits";

function UserComp() {
  const auth = getAuth();
  auth.languageCode = "it";

  const userClick = () => {
    if (auth.currentUser.isAnonymous) {
      var provider = new GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
      provider.setCustomParameters({
        login_hint: "user@example.com",
      });

      linkWithPopup(auth.currentUser, provider)
        .then(function (result) {
          var user = result.user;
          Register(user);
        })
        .catch(function (error) {
          if (error.code === "auth/credential-already-in-use") {
            const credential = GoogleAuthProvider.credentialFromError(error);

            signInWithCredential(auth, credential)
              .then(function (result) {
                var user = result.user;
                console.log(user);
              })
              .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
              });
          }
        });
    } else {
      auth.signOut();
      window.location = "/";
    }
  };

  return (
    <div className="tool-user">
      <div className="user-avatar"></div>
      <div className="user-details">
        <p>Guest</p>
        <a href="" onClick={userClick}>
          Login
        </a>
      </div>
    </div>
  );
}

export default UserComp;
