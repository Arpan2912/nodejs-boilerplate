const csv = require("csvtojson");
const multer = require("multer");
const crypto = require("crypto");
const Sequelize = require("sequelize");
const nodemailer = require("nodemailer");
const aws = require("aws-sdk");
const db = require("../../db");
const AppLogger = require("../../config/app.logger");

// multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });
const fileUploadMiddleware = upload.single("csv");

function prepareSuccessResponse(message, data) {
  const obj = {
    data,
    message,
    success: true
  };
  return obj;
}

function prepareErrorResponse(message, data) {
  const obj = {
    data,
    message,
    success: false
  };
  return obj;
}

function logErrorAndSendResponse(e, res, data) {
  const msg = e.msg ? e.msg : "Something went wrong";
  const code = e.code ? e.code : 500;
  // eslint-disable-next-line no-console
  console.error(e);
  if (e instanceof Error) {
    AppLogger.error(e);
  }
  const errorObj = prepareErrorResponse(msg, data);
  return res.status(code).send(errorObj);
}

function sendEmail() {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "abc@gmail.com", // generated ethereal user
      pass: "123452342" // generated ethereal password
    }
  });

  // send mail with defined transport object
  const info = transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>" // html body
  });

  // eslint-disable-next-line no-console
  console.log("Message sent: %s", info.messageId);
}

function executeSqlQuery(query, replacements, operation) {
  return new Promise((resolve, reject) => {
    let queryType;
    if (operation === "insert") {
      queryType = Sequelize.QueryTypes.INSERT;
    } else if (operation === "update") {
      queryType = Sequelize.QueryTypes.UPDATE;
    } else if (operation === "select") {
      queryType = Sequelize.QueryTypes.SELECT;
    } else if (operation === "delete") {
      queryType = Sequelize.QueryTypes.DELETE;
    } else {
      queryType = Sequelize.QueryTypes.SELECT;
    }
    db.sequelize
      .query(query, { replacements, type: queryType })
      .then(data => {
        resolve(data);
      })
      .catch(err => {
        reject(err);
      });
  });
}

function log(obj, isError) {
  let msg = null;
  const level = isError ? "error" : "info";
  if (typeof obj === "object") {
    msg = JSON.stringify(obj);
  } else if (typeof obj === "string") {
    msg = obj;
  } else if (obj instanceof Error) {
    AppLogger.error(obj);
    return;
  }
  AppLogger.log({
    level,
    message: msg
  });
}

function uploadImageOnAmazonS3(
  bucketName,
  fileName,
  bufferdata,
  contentType,
  // eslint-disable-next-line no-unused-vars
  userId,
  // eslint-disable-next-line no-unused-vars
  module
) {
  return new Promise((resolve, reject) => {
    const s3 = new aws.S3({
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_KEY
      // region:'us-east-1',
    });

    const params = {
      ACL: "public-read-write",
      Body: bufferdata,
      // Bucket: 'd-fix-test',
      Bucket: process.env.BUCKET_NAME,
      Key: `${fileName}`,
      // ServerSideEncryption: null,
      Tagging: "usage=byDeveloper",
      ContentEncoding: "base64",
      ContentType: contentType
    };

    // let bucketFolder = `${bucketName}/${userId}`;
    // const bucketFolder = `${process.env.BUCKET_NAME}/${userId}`;
    const executeUploadOnAmazonS3 = () => {
      s3.upload(params, function callback(err, result) {
        if (err) {
          reject(err);
        } else {
          // eslint-disable-next-line no-console
          console.log("******** File upload on s3 completed ********", result);
          resolve(result);
        }
      });
    };
    executeUploadOnAmazonS3();
  });
}

/**
 * extract extension from base64 string
 * @param {string} image
 */
function extractExtension(image) {
  const imageString = image.slice(0, 70);
  if (imageString.match(/data:image\/png/)) {
    return "image/png";
  }
  if (imageString.match(/data:image\/jpeg/)) {
    return "image/jpeg";
  }
  if (imageString.match(/data:image\/gif/)) {
    return "image/gif";
  }
  return "image/jpeg";
}

function readFileAndReturnCsvArray(req) {
  const csvData = req.file.buffer.toString("utf8");
  return csv().fromString(csvData);
}

async function sha512(password, salt) {
  const hash = crypto.createHmac("sha512", salt);
  hash.update(password);
  const value = hash.digest("hex");
  return {
    salt,
    passwordHash: value
  };
}

function generateSha512Hash(password) {
  // password is added to remove unused error
  return crypto
    .createHash("sha512")
    .update(password)
    .digest("hex");
}

async function genRandomString(length = 50) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex") /** convert to hexadecimal format */
    .slice(0, length); /** return required number of characters */
}

async function generateSalt() {
  const salt = await genRandomString(32); /** Gives us salt of length 32 */
  return salt;
}

module.exports = {
  prepareSuccessResponse,
  prepareErrorResponse,
  logErrorAndSendResponse,
  executeSqlQuery,
  sendEmail,
  log,
  uploadImageOnAmazonS3,
  extractExtension,
  fileUploadMiddleware,
  readFileAndReturnCsvArray,
  generateSalt,
  sha512,
  generateSha512Hash,
  genRandomString
};
