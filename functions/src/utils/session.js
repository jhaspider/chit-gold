const admin = require("firebase-admin");
const auth = admin.auth();

// - Verify the session id
const validateUser = async (sessionId) => {
  console.log(`session id - ${sessionId}`);
  return new Promise((resolve, reject) => {
    auth
      .getUser(sessionId)
      .then((data) => {
        console.log(data);
        return resolve(data);
      })
      .catch((error) => {
        console.log(error);
        return reject(error);
      });
  });
};

// - Deleting the anonymous user once a valid registration occurs
const deleteUser = async (sessionId) => {
  return new Promise((resolve, reject) => {
    auth
      .deleteUser(sessionId)
      .then(() => {
        return resolve(true);
      })
      .catch((error) => {
        return reject(error);
      });
  });
};

module.exports = {
  validateUser,
  deleteUser,
};
