const { executeSqlQuery } = require("../common/common.services");
const { qGetUserDetailFromUuid } = require("../../config/app.query");

async function getUserDetail(uuid) {
  const obj = {
    u_uuid: uuid
  };

  const userDetail = await executeSqlQuery(
    qGetUserDetailFromUuid,
    obj,
    "select"
  );

  if (userDetail.length === 0) {
    throw { code: 401, msg: "user not exist" };
  }

  return Promise.resolve(userDetail[0]);
}

module.exports = {
  getUserDetail
};
