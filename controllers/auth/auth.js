const { prepareSuccessResponse } = require('../../services/common/common.services');

module.exports = class Auth {
  static signin(req, res) {
    let response = prepareSuccessResponse("login success", null);
    return res.status(200).send(response);
  }
}