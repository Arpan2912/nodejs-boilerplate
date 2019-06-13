const indexRouter = require('../routes/index');
const userRouter = require('../routes/users');
const authRouter = require('../routes/auth');

module.exports = class AppRoutes {
  static init(app) {
    app.use('/', indexRouter);
    app.use('/user', userRouter);
    app.use('/auth', authRouter);
    return app;
  }
}