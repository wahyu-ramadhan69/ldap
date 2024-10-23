import LdapAuth from "ldapauth-fork";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config(); // Initialize dotenv

const JWT_SECRET = process.env.JWT_SECRET; // Read secret key from .env

// LDAP configuration function
const ldapConfig = (username) => ({
  url: process.env.LDAP_URL,
  bindDN: process.env.LDAP_BIND_DN,
  bindCredentials: process.env.LDAP_BIND_PASSWORD,
  searchBase: process.env.LDAP_SEARCH_BASE,
  searchFilter: `(sAMAccountName=${username})`,
  reconnect: true,
});

export const authenticateUser = async (username, password) => {
  const auth = new LdapAuth(ldapConfig(username));

  return new Promise((resolve, reject) => {
    auth.authenticate(username, password, (err, user) => {
      if (err && err.name === "InvalidCredentialsError") {
        auth.close(() => {
          console.log("LDAP connection closed after error.");
        });
        return reject({ errorType: "invalidPassword" });
      }
      if (!user) {
        auth.close(() => {
          console.log("LDAP connection closed after user not found.");
        });
        return reject({ errorType: "userNotFound" });
      }
      auth.close(() => {
        console.log("LDAP connection closed after successful authentication.");
      });
      resolve(user);
    });
  });
};

export const generateToken = (user) => {
  let role = "";
  if (user.title === "Staff") {
    role = "USER";
  } else if (user.title === "Departemen Head") {
    role = "HEAD";
  }

  const token = jwt.sign(
    {
      username: user.sAMAccountName,
      role,
      divisi: user.department,
    },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return token;
};
