const express = require("express");

const router = express.Router();

const Auth = require("../controllers/auth/auth");

router.route("/signin").post(Auth.signin);

router.route("/signup").post(Auth.signup);

router.route("/verify-user/:token").get(Auth.verifyUser);

module.exports = router;
