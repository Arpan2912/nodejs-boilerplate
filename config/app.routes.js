const expressJwt = require("express-jwt");
const fs = require("fs");
const indexRouter = require("../routes/index");
const userRouter = require("../routes/users");
const authRouter = require("../routes/auth");
const { getUserDetail } = require("../services/user/user.services");

const publicKeyPath = `${__dirname}/../.auth/auth.private.key.pub`;
const publicKey = fs.readFileSync(publicKeyPath);

module.exports = class AppRoutes {
  static init(app) {
    const allowAccess = expressJwt({
      secret: publicKey
    }).unless({
      path: [
        "/auth/signin",
        "/auth/signup",
        /^\/auth\/verify-user\.*/,
        /^\/auth\/forgot-password\.*/,
        /^\/auth\/forgot-password-validate\.*/,
        "/auth/reset-password"
        // '/auth/verify-user/*'
      ]
    });

    app.all(["/*"], allowAccess);

    app.use(async (req, res, next) => {
      if (req.user) {
        const { userId } = req.user;
        try {
          const userDetail = await getUserDetail(userId);
          if (
            userDetail.is_deleted === true ||
            userDetail.is_active === false
          ) {
            throw { code: 401, msg: "User is inactive" };
          }
          req.userDetail = userDetail;
          next();
        } catch (e) {
          const resObj = {
            success: true,
            logout: true,
            data: null,
            msg: e.msg ? e.msg : "Something went wrong"
          };
          return res.status(401).send(resObj);
        }
      } else {
        next();
      }
    });

    app.use("/", indexRouter);
    app.use("/user", userRouter);
    app.use("/auth", authRouter);

    app.use(function(err, req, res) {
      if (err.name === "UnauthorizedError") {
        res.status(401).send("invalid token...");
      }
    });
    return app;
  }
};
