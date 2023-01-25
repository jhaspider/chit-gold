import React from "react";
import { useNavigate } from "react-router-dom";
import { useChitContext } from "../chit-provider";
import useFirebaseLogin from "../firebase-login";

function UserComp() {
  const { user } = useChitContext();
  const navigate = useNavigate();
  const { login, logout } = useFirebaseLogin();

  const onLoginTap = (e) => {
    e.preventDefault();
    login();
  };

  const onLogoutTap = async (e) => {
    e.preventDefault();
    await logout();
    navigate("/");
  };

  if (!user) return null;

  console.log(user);
  return (
    <div className="tool-user">
      <div className="user-avatar"></div>
      <div className="user-details">
        <p>{user.isAnonymous ? "Guest" : user.displayName ? user.displayName : user.email}</p>
        {user.isAnonymous ? (
          <a href="" onClick={onLoginTap}>
            Login
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
