const {
  readFileAndReturnCsvArray,
  prepareSuccessResponse
} = require("../../services/common/common.services");

module.exports = class UserController {
  static loadInitialApi(req, res) {
    return res.status(200).send("Loaded from user controller");
  }

  static async fileUpload(req, res) {
    const json = await readFileAndReturnCsvArray(req);
    const resObj = prepareSuccessResponse(
      "File upoaded successfully",
      json,
      true
    );
    return res.status(200).send(resObj);
  }
};
