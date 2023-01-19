import Events from "../utils/events";
import Utils from "../utils/utils";
import axios from "../utils/axios";
import "../firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider, linkWithCredential, linkWithPopup } from "firebase/auth";
import EndPoints from "../utils/endpoints";
import { Register } from "../utils/save_chits";

function UserComp() {
  const buildDom = () => {
    const container = Utils.newElem("div", null, "user-comp");
    container.addEventListener("click", userClick);
    return container;
  };

  const userClick = (e) => {
    const auth = getAuth();

    const currentUser = auth.currentUser;

    if (!currentUser || currentUser.isAnonymous) {
      const provider = new GoogleAuthProvider();
      linkWithPopup(auth.currentUser, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const user = result.user;

          Register(user);
        })
        .catch((error) => {});
    }
  };

  const container = buildDom();
  return { dom: container };
}

export default UserComp;
