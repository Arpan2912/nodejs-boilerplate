/* eslint-disable no-throw-literal */
/* eslint-disable consistent-return */
const {
  prepareSuccessResponse,
  logErrorAndSendResponse,
  log
} = require("../../services/common/common.services");
const {
  signin,
  signup,
  verifyUser,
  updatePassword,
  forgotPassword,
  forgotPasswordValidate,
  resetPassword
} = require("../../services/auth/auth.services");

module.exports = class Auth {
  static async signin(req, res) {
    try {
      req.checkBody("email", "Email should  not be empty").notEmpty();
      // req.checkBody("password", "password should not be empty").isEmpty();

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

  static async updatePassword(req, res) {
    try {
      // req.checkParams("password",
      // "Password should  not be empty").notEmpty();

      const errors = req.validationErrors();
      if (errors) {
        const { msg } = errors[0];
        throw { code: 500, msg };
      }

      await updatePassword(req);
      const response = prepareSuccessResponse(
        "Reset password successfully",
        null
      );
      return res.status(200).send(response);
    } catch (e) {
      logErrorAndSendResponse(e, res, null);
    }
  }

  static async forgotPassword(req, res) {
    try {
      const errors = req.validationErrors();
      if (errors) {
        const { msg } = errors[0];
        throw { code: 500, msg };
      }

      await forgotPassword(req);
      const response = prepareSuccessResponse(
        "Forgot password link has been sent to your email",
        null
      );
      return res.status(200).send(response);
    } catch (e) {
      logErrorAndSendResponse(e, res, null);
    }
  }

  static async forgotPasswordValidate(req, res) {
    try {
      const errors = req.validationErrors();
      if (errors) {
        const { msg } = errors[0];
        throw { code: 500, msg };
      }

      const response = await forgotPasswordValidate(req);
      return res.render("forgot-password", response);
      // const response = prepareSuccessResponse(
      //   "Password has been reseted successfully",
      //   null
      // );
      // return res.status(200).send(response);
    } catch (e) {
      const msg = e.msg ? e.msg : "Something went wrong";
      // eslint-disable-next-line no-console
      console.error(e);
      if (e instanceof Error) {
        log(e, true);
      }
      return res.render("error", { msg });
      // logErrorAndSendResponse(e, res, null);
    }
  }

  static async resetPassword(req, res) {
    try {
      const errors = req.validationErrors();
      if (errors) {
        const { msg } = errors[0];
        throw { code: 500, msg };
      }

      await resetPassword(req);
      return res.render("success", { msg: "Password updated successfuly" });
      // const response = prepareSuccessResponse(
      //   "Password has been reseted successfully",
      //   null
      // );
      // return res.status(200).send(response);
    } catch (e) {
      const msg = e.msg ? e.msg : "Something went wrong";
      // eslint-disable-next-line no-console
      console.error(e);
      if (e instanceof Error) {
        log(e, true);
      }
      return res.render("error", { msg });
    }
  }
};
