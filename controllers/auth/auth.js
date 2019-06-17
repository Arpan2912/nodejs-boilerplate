const { prepareSuccessResponse, logErrorAndSendResponse } = require('../../services/common/common.services');
const AppLogger = require('../../config/app.logger');
const { signin, signup, verifyUser } = require('../../services/auth/auth.services');

module.exports = class Auth {
  
  static async signin(req, res) {
    console.log("req body", req.body);
    try {
      req.checkBody('email', 'Email should  not be empty').notEmpty();
      req.checkBody('password', 'password should not be empty').isEmpty();

      let errors = req.validationErrors();
      if (errors) {
        console.log(errors[0].msg);
        let msg = errors[0].msg;
        throw ({ code: 500, msg: msg });
      }
      let obj = {
        email: req.body.email,
        password: req.body.password
      }

      let resObj = await signin(obj);

      let response = prepareSuccessResponse("login success", resObj);
      return res.status(200).send(response);

    } catch (e) {
      logErrorAndSendResponse(e, res, null);
    }
  }

  static async signup(req, res) {
    try {
      req.checkBody('email', 'Email should  not be empty').notEmpty();
      req.checkBody('firstName', 'First name should  not be empty').notEmpty();
      req.checkBody('lastName', 'Last name should  not be empty').notEmpty();
      req.checkBody('phone', 'Phone should  not be empty').notEmpty();
      req.checkBody('password', 'Password should  not be empty').notEmpty();
      // req.checkBody('password', 'password should not be empty').isEmpty();

      let errors = req.validationErrors();
      if (errors) {
        console.log(errors[0].msg);
        let msg = errors[0].msg;
        throw ({ code: 500, msg: msg });
      }

      let resObj = await signup(req.body);

      let response = prepareSuccessResponse("Signup success, Please verify your email address", resObj);
      return res.status(200).send(response);

    } catch (e) {
      logErrorAndSendResponse(e, res, null);
    }
  }

  static async verifyUser(req, res) {
    try {
      req.checkParams('token', 'Token should  not be empty').notEmpty();

      let errors = req.validationErrors();
      if (errors) {
        console.log(errors[0].msg);
        let msg = errors[0].msg;
        throw ({ code: 500, msg: msg });
      }
      let token = req.params.token;
      let resObj = await verifyUser(token);

      let response = prepareSuccessResponse("User verified successfully", null);
      return res.status(200).send(response);

    } catch (e) {
      logErrorAndSendResponse(e, res, null);
    }
  }

}