import Events from "../utils/events";
import Utils from "../utils/utils";
import axios from "axios";
import "../firebase";
import { getAuth, signInWithPopup, GoogleAuthProvider, linkWithCredential, linkWithPopup } from "firebase/auth";

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
          console.log(user);
        })
        .catch((error) => {});
    } else {
      console.log(`Logged In user.`);
      registerUser(currentUser);
    }
  };

  const registerUser = (currentUser) => {
    console.log(currentUser);
    const data = {
      uid: currentUser.uid,
      displayName: currentUser.displayName,
      email: currentUser.email,
      metadata: currentUser.metadata,
      provider: currentUser.providerData.length > 0 ? currentUser.providerData[0] : null,
    };
    axios({
      method: "post",
      url: "http://127.0.0.1:5001/cheat-sheet-62dad/asia-south1/apis-user-user/register",
      data,
    }).then(function (response) {
      console.log(response);
    });
  };

  const container = buildDom();
  return { dom: container };
}

export default UserComp;
