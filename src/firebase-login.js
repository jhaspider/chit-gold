import React from "react";
import { getAuth, GoogleAuthProvider, linkWithPopup, signInWithCredential } from "firebase/auth";

import { useChitContext } from "./chit-provider";
import useApi from "./utils/save_chits";

function useFirebaseLogin() {
  const { setUser } = useChitContext();
  const { Register } = useApi();

  const auth = getAuth();

  const login = async () => {
    return new Promise(async (resolve, reject) => {
      auth.languageCode = "it";
      if (auth.currentUser.isAnonymous) {
        var provider = new GoogleAuthProvider();
        provider.addScope("https://www.googleapis.com/auth/userinfo.profile");
        provider.setCustomParameters({
          login_hint: "user@example.com",
        });

        linkWithPopup(auth.currentUser, provider)
          .then((result) => {
            var user = result.user;
            Register(user);
            resolve(user);
          })
          .catch(function (error) {
            if (error.code === "auth/credential-already-in-use") {
              const credential = GoogleAuthProvider.credentialFromError(error);

              signInWithCredential(auth, credential)
                .then(function (result) {
                  var user = result.user;
                  resolve(user);
                })
                .catch((error) => {
                  const errorCode = error.code;
                  const errorMessage = error.message;
                  const email = error.email;
                  const credential = GoogleAuthProvider.credentialFromError(error);
                  reject(null);
                });
            } else {
              reject(null);
            }
          });
      }
    });
  };

  const logout = async () => {
    setUser(null);
    auth.signOut();
  };
  return { login, logout };
}

export default useFirebaseLogin;
