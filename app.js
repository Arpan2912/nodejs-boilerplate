require("dotenv").config();

const createError = require("http-errors");
const express = require("express");

const AppRoutes = require("./config/app.routes");
const AppMiddleware = require("./config/app.middleware");

const app = express();

AppMiddleware.init(app);
AppRoutes.init(app);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
