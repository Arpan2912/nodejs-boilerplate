const indexRouter = require('../routes/index');
const userRouter = require('../routes/users');
const authRouter = require('../routes/auth');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const publicKeyPath = `${__dirname}/../.auth/auth.private.key.pub`;
const publicKey = fs.readFileSync(publicKeyPath);

module.exports = class AppRoutes {
  static init(app) {
    let allowAccess = expressJwt({
      secret: publicKey,
    }).unless({
      path: [
        '/auth/signin',
        '/auth/signup',
        /^\/auth\/verify-user\.*/,
        // '/auth/verify-user/*'
      ]
    });

    app.all(["/*"], allowAccess);
    app.use('/', indexRouter);
    app.use('/user', userRouter);
    app.use('/auth', authRouter);

    app.use(function (err, req, res, next) {
      if (err.name === 'UnauthorizedError') {
        res.status(401).send('invalid token...');
      }
    });
    return app;
  }
}