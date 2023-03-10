import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import React, { useContext, useEffect, useState } from "react";

const ChitContext = React.createContext();

export const useChitContext = () => {
  return useContext(ChitContext);
};

const TAG = "ChitProvider - ";
const ChitProvider = (props) => {
  const [user, setUser] = useState(null);
  const [spinner, setSpinner] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        signInAnonymously(auth)
          .then((user) => {})
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
          });
      }
    });
  }, []);
  if (!user) return null;

  return <ChitContext.Provider value={{ user, setUser, spinner, setSpinner, error, setError }}>{props.children}</ChitContext.Provider>;
};

export default ChitProvider;
