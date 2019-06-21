const express = require("express");
const Auth = require("../controllers/auth/auth");

const router = express.Router();

router.route("/signin").post(Auth.signin);

router.route("/signup").post(Auth.signup);

router.route("/verify-user/:token").get(Auth.verifyUser);

router.route("/update-password").put(Auth.updatePassword);

router.route("/reset-password").post(Auth.resetPassword);

router.route("/forgot-password/:email").get(Auth.forgotPassword);

router
  .route("/forgot-password-validate/:token")
  .get(Auth.forgotPasswordValidate);

module.exports = router;
