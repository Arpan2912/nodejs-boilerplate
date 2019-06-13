
module.exports = class UserController {
  static loadInitialApi(req, res) {
    return res.status(200).send("Loaded from user controller");
  }
}