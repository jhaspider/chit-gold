import Events from "../utils/events";
import Utils from "../utils/utils";
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
    console.log(currentUser);
    if (!currentUser || currentUser.isAnonymous) {
      const provider = new GoogleAuthProvider();
      linkWithPopup(auth.currentUser, provider)
        .then((result) => {
          // Accounts successfully linked.
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;

          const user = result.user;
          console.log(user);
          // ...
        })
        .catch((error) => {
          // Handle Errors here.
          // ...
        });
    } else {
      console.log(`Logged In user.`);
    }
  };

  const container = buildDom();
  return { dom: container };
}

export default UserComp;
