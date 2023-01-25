import React from "react";
import { getAuth, GoogleAuthProvider, linkWithPopup, signInWithCredential } from "firebase/auth";
import { Register } from "./utils/save_chits";
import { useChitContext } from "./chit-provider";

function useFirebaseLogin() {
  const { setUser } = useChitContext();
  const auth = getAuth();
  const login = async () => {
    auth.languageCode = "it";
    if (auth.currentUser.isAnonymous) {
      var provider = new GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/userinfo.profile.readonly");
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
                setUser(user);
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

  const logout = async () => {
    setUser(null);
    auth.signOut();
  };
  return { login, logout };
}

export default useFirebaseLogin;
