const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user/user');

/* GET users listing. */
router
  .route('/')
  .get(UserController.loadInitialApi);

module.exports = router;
