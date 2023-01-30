import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChitContext } from "../chit-provider";
import useFirebaseLogin from "../firebase-login";

function UserComp() {
  const { user, setUser } = useChitContext();
  const navigate = useNavigate();
  const { login, logout } = useFirebaseLogin();
  const profileRef = useRef(null);
  const [flag, setFlag] = useState(false);

  const onLoginTap = async (e) => {
    e.preventDefault();
    const user = await login();
    if (user) {
      console.log(`User-Comp`, user);
      setUser(user);
      // setFlag(true);
    }
  };

  const onLogoutTap = async (e) => {
    e.preventDefault();
    await logout();
    navigate("/");
  };

  // Hide image if the src has a broken url
  useEffect(() => {
    if (profileRef.current) {
      profileRef.current.onerror = () => {
        profileRef.current.style.display = "none";
      };
    }
  }, [profileRef]);

  if (!user) return null;

  const displayName = user.isAnonymous ? "Guest" : user.displayName ? user.displayName : user.email;
  return (
    <div className="tool-user">
      <div className="user-avatar">{user.photoURL && <img ref={profileRef} src={user.photoURL} alt={displayName} />}</div>
      <div className="user-details">
        <p>{displayName}</p>
        {user.isAnonymous ? (
          <a href="" onClick={onLoginTap}>
            Login using Google
          </a>
        ) : (
          <a href="" onClick={onLogoutTap}>
            Logout
          </a>
        )}
      </div>
    </div>
  );
}

export default UserComp;
