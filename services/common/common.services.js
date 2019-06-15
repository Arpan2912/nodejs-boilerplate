const csv = require('csvtojson');
const multer = require('multer');
const crypto = require("crypto");
const Sequelize = require('sequelize');
const nodemailer = require('nodemailer');

const db = require('../../db');
const AppLogger = require('../../config/app.logger');

//multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const fileUploadMiddleware = upload.single('csv');

function prepareSuccessResponse(message, data) {
  let obj = {
    data,
    message,
    success: true
  }
  return obj;
}

function prepareErrorResponse(message, data) {
  let obj = {
    data,
    message,
    success: false
  }
  return obj;
}

function sendEmail() {
  let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user, // generated ethereal user
      pass: testAccount.pass // generated ethereal password
    }
  });

  // send mail with defined transport object
  let info = transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>" // html body
  });

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
      .query(query, { replacements: replacements, type: queryType })
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
  let level = isError ? 'error' : 'info';
  if (typeof obj === 'object') {
    msg = JSON.stringify(obj)
  } else if (typeof obj === 'string') {
    msg = obj;
  }
  AppLogger.log({
    level: level,
    message: msg
  })
};

function uploadImageOnAmazonS3(bucketName, fileName, bufferdata, contentType, userId, module) {
  return new Promise((resolve, reject) => {
    let s3 = new aws.S3({
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_KEY,
      // region:'us-east-1',
    });

    let params = {
      ACL: 'public-read-write',
      Body: bufferdata,
      // Bucket: 'd-fix-test',
      Bucket: process.env.BUCKET_NAME,
      Key: `${fileName}`,
      // ServerSideEncryption: null,
      Tagging: "usage=byDeveloper",
      ContentEncoding: 'base64',
      ContentType: contentType,
    };

    // let bucketFolder = `${bucketName}/${userId}`;
    let bucketFolder = `${process.env.BUCKET_NAME}/${userId}`;
    let executeUploadOnAmazonS3 = () => {
      s3.upload(params, function (err, result) {
        if (err) {
          // throw new Error(err);
          reject(err);
        } else {
          console.log('******** File upload on s3 completed ********', result);
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
  var imageString = image.slice(0, 70);
  if (imageString.match(/data:image\/png/)) {
    return "image/png";
  } else if (imageString.match(/data:image\/jpeg/)) {
    return "image/jpeg";
  } else if (imageString.match(/data:image\/gif/)) {
    return "image/gif";
  } else {
    return "image/jpeg";
  }
}

function readFileAndReturnCsvArray(req) {
  console.log(req.file);
  let csvData = req.file.buffer.toString('utf8');
  return csv().fromString(csvData);
}

async function sha512(password, salt) {
  let hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  let value = hash.digest('hex');
  return await {
    salt: salt,
    passwordHash: value
  };
};

async function generateSalt() {
  var salt = await genRandomString(32); /** Gives us salt of length 32 */
  return salt;
}

async function genRandomString(length = 50) {
  return await crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex') /** convert to hexadecimal format */
    .slice(0, length);   /** return required number of characters */
};

module.exports = {
  "prepareSuccessResponse": prepareSuccessResponse,
  "prepareErrorResponse": prepareErrorResponse,
  "executeSqlQuery": executeSqlQuery,
  "sendEmail": sendEmail,
  "log": log,
  "uploadImageOnAmazonS3": uploadImageOnAmazonS3,
  "extractExtension": extractExtension,
  "fileUploadMiddleware": fileUploadMiddleware,
  "readFileAndReturnCsvArray": readFileAndReturnCsvArray,
  "generateSalt": generateSalt,
  "sha512": sha512
}