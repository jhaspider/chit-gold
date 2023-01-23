import Events from "../utils/events";
import Utils from "../utils/utils";
import axios from "../utils/axios";
import "../firebase";
import { getAuth, signInWithPopup, getRedirectResult, GoogleAuthProvider, linkWithCredential, linkWithPopup, signInWithCredential, linkWithRedirect, signInWithRedirect } from "firebase/auth";
import EndPoints from "../utils/endpoints";
import { Register } from "../utils/save_chits";

function UserComp() {
  const auth = getAuth();
  auth.languageCode = "it";

  const buildDom = () => {
    const wrapper = Utils.newElem("div", null, "tool-user");
    const dom = Utils.newElem("div", null, "user-comp");
    dom.addEventListener("click", userClick);
    wrapper.append(dom);
    return wrapper;
  };

  const userClick = (e) => {
    const currentUser = auth.currentUser;

    if (currentUser.isAnonymous) {
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
    }
  };

  const container = buildDom();
  return { dom: container };
}

export default UserComp;
