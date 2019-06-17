const express = require("express");

const router = express.Router();

const UserController = require("../controllers/user/user");
const { fileUploadMiddleware } = require("../services/common/common.services");

/* GET users listing. */
router.route("/").get(UserController.loadInitialApi);

router.route("/upload").post(fileUploadMiddleware, UserController.fileUpload);

module.exports = router;
