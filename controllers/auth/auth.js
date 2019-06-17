/* eslint-disable no-throw-literal */
/* eslint-disable consistent-return */
const {
  prepareSuccessResponse,
  logErrorAndSendResponse
} = require("../../services/common/common.services");
const {
  signin,
  signup,
  verifyUser
} = require("../../services/auth/auth.services");

module.exports = class Auth {
  static async signin(req, res) {
    try {
      req.checkBody("email", "Email should  not be empty").notEmpty();
      req.checkBody("password", "password should not be empty").isEmpty();

      const errors = req.validationErrors();
      if (errors) {
        const { msg } = errors[0];
        throw { code: 500, msg };
      }
      const obj = {
        email: req.body.email,
        password: req.body.password
      };

      const resObj = await signin(obj);

      const response = prepareSuccessResponse("login success", resObj);
      return res.status(200).send(response);
    } catch (e) {
      logErrorAndSendResponse(e, res, null);
    }
  }

  static async signup(req, res) {
    try {
      req.checkBody("email", "Email should  not be empty").notEmpty();
      req.checkBody("firstName", "First name should  not be empty").notEmpty();
      req.checkBody("lastName", "Last name should  not be empty").notEmpty();
      req.checkBody("phone", "Phone should  not be empty").notEmpty();
      req.checkBody("password", "Password should  not be empty").notEmpty();
      // req.checkBody('password', 'password should not be empty').isEmpty();

      const errors = req.validationErrors();
      if (errors) {
        const { msg } = errors[0];
        throw { code: 500, msg };
      }

      const resObj = await signup(req.body);

      const response = prepareSuccessResponse(
        "Signup success, Please verify your email address",
        resObj
      );
      return res.status(200).send(response);
    } catch (e) {
      logErrorAndSendResponse(e, res, null);
    }
  }

  static async verifyUser(req, res) {
    try {
      req.checkParams("token", "Token should  not be empty").notEmpty();

      const errors = req.validationErrors();
      if (errors) {
        const { msg } = errors[0];
        throw { code: 500, msg };
      }
      const { token } = req.params;
      await verifyUser(token);
      const response = prepareSuccessResponse(
        "User verified successfully",
        null
      );
      return res.status(200).send(response);
    } catch (e) {
      logErrorAndSendResponse(e, res, null);
    }
  }
};
