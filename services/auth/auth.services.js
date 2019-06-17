/* eslint-disable no-use-before-define */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-throw-literal */
const jwt = require("jsonwebtoken");
const fs = require("fs");
const uuidv4 = require("uuidv4");

const {
  executeSqlQuery,
  sha512,
  generateSalt,
  genRandomString
} = require("../common/common.services");
const {
  qGetUserDetail,
  qCreateUser,
  qCreateUserToken,
  qGetTokenDetail,
  qUpdateUser,
  qDeleteUserToken
} = require("../../config/app.query");

const privateKeyPath = `${__dirname}/../../.auth/auth.private.key`;

const privateKey = fs.readFileSync(privateKeyPath);

async function signin(obj) {
  let user = null;
  const { password } = obj;
  let salt = null;

  const replacement = {
    email: obj.email
  };
  const userDetail = await executeSqlQuery(
    qGetUserDetail,
    replacement,
    "select"
  );
  if (userDetail.length === 0) {
    throw { code: 409, msg: "User does not exist" };
  }
  user = userDetail[0];

  if (user.is_deleted === true) {
    throw { code: 409, msg: "User is removed by admin" };
  }
  if (user.is_active === false && user.last_login === null) {
    throw { code: 409, msg: "Please verify your email address" };
  }
  if (user.is_active === false) {
    throw { code: 409, msg: "User is inactive" };
  }

  salt = user.salt;
  const { passwordHash } = await sha512(password, salt);
  if (passwordHash === user.password) {
    const jwtObj = {
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      userId: user.u_uuid
    };
    const token = await generateJWTToken(jwtObj);
    const resObj = {
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      userId: user.u_uuid,
      token
    };

    return Promise.resolve(resObj);
  }
  throw { code: 500, msg: "Please enter correct email id or password" };
}

async function signup(obj) {
  let user = null;
  const findUserReplacement = {
    email: obj.email
  };

  const userDetails = await executeSqlQuery(
    qGetUserDetail,
    findUserReplacement,
    "select"
  );
  if (userDetails.length > 0) {
    user = userDetails[0];
    if (user.is_deleted === true) {
      throw { code: 409, msg: "User is blocked by admin" };
    } else if (user.is_active === false) {
      throw { code: 409, msg: "Please verify your emailI" };
    } else {
      throw { code: 409, msg: "User already exist" };
    }
  } else {
    const salt = await generateSalt();
    const { passwordHash: password } = await sha512(obj.password, salt);

    const createUserReplacement = {
      u_uuid: uuidv4(),
      email: obj.email,
      first_name: obj.firstName,
      last_name: obj.lastName,
      phone: obj.phone,
      salt,
      password,
      city: obj.city,
      state: obj.state,
      country: obj.country,
      address: obj.address,
      user_type: obj.userType,
      google_id: obj.googleId,
      last_login: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    let result = await executeSqlQuery(
      qCreateUser,
      createUserReplacement,
      "insert"
    );
    user = result[0][0];
    const token = await genRandomString(30);

    const userTokenReplacement = {
      u_uuid: uuidv4(),
      user_id: user.id,
      type: "user",
      token,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    result = await executeSqlQuery(
      qCreateUserToken,
      userTokenReplacement,
      "insert"
    );

    return Promise.resolve(user);
  }
}

async function verifyUser(token) {
  const replacement = {
    token,
    type: "user"
  };
  let tokenDetail = await executeSqlQuery(
    qGetTokenDetail,
    replacement,
    "select"
  );
  if (tokenDetail.length === 0) {
    throw { code: 409, msg: "Token Expired" };
  }

  tokenDetail = tokenDetail[0];

  if (tokenDetail.is_active === false) {
    throw { code: 409, msg: "Token is not valid" };
  }

  const updateUserReplacement = {
    where_id: tokenDetail.id,
    is_active: true
  };

  await executeSqlQuery(
    qUpdateUser(updateUserReplacement),
    updateUserReplacement,
    "update"
  );

  const deleteUserTokenReplacement = {
    token
  };
  await executeSqlQuery(qDeleteUserToken, deleteUserTokenReplacement, "delete");
  return Promise.resolve();
}

function generateJWTToken(obj) {
  const signOptions = {
    algorithm: "RS256"
  };
  return jwt.sign(obj, privateKey, signOptions);
}

module.exports = {
  signin,
  signup,
  verifyUser
};
