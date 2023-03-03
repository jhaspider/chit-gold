import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChitContext } from "../chit-provider";
import useFirebaseLogin from "../firebase-login";

const UserCompMobile = () => {
  const { user, setUser } = useChitContext();
  const navigate = useNavigate();
  const { login, logout } = useFirebaseLogin();
  const profileRef = useRef(null);
  const userDetailsRef = useRef(null);

  const onLoginTap = async (e) => {
    e.preventDefault();
    const user = await login();
    if (user) {
      setUser(user);
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

  const onAvatarTap = (e) => {
    e.preventDefault();
    userDetailsRef.current.classList.toggle("hide");
  };

  if (!user) return null;

  let displayName = user.isAnonymous ? "Guest" : user.displayName ? user.displayName : user.email;
  const provider = user.providerData.length > 0 ? user.providerData[0] : null;
  if (provider?.displayName) {
    displayName = provider.displayName;
  }

  let userPhoto = user.photoURL;
  if (provider?.photoURL) {
    userPhoto = provider.photoURL;
  }

  if (user.isAnonymous) {
    return (
      <div className="avatar">
        <div className="user-avatar" onClick={onLoginTap}>
          <img style={{ marginTop: 4 }} src="/icons/anonymous.png" />
        </div>
      </div>
    );
  }

  const displayChar = displayName && displayName.length > 0 ? displayName.charAt(0).toUpperCase() : " ";
  return (
    <div className="avatar">
      <div className={`user-avatar active`} onClick={onAvatarTap}>
        {userPhoto ? <img ref={profileRef} src={userPhoto} alt={displayName} /> : <span>{displayChar}</span>}
      </div>
      {!user.isAnonymous && (
        <div className="user-details hide" ref={userDetailsRef}>
          <p>{displayName}</p>
          <a href="" onClick={onLogoutTap}>
            Logout
          </a>
        </div>
      )}
    </div>
  );
};

export default UserCompMobile;
