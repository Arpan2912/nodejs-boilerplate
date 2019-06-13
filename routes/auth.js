const express = require('express');
const router = express.Router();

const Auth = require('../controllers/auth/auth');

router
  .route('/signin')
  .get(Auth.signin);

module.exports = router;
