const winston = require('winston');
const winstonDailyRotateFile = require('winston-daily-rotate-file');

const errorStackTracerFormat = winston.format(info => {
  if (info instanceof Error) {
    info.message = ` ${info.stack}`;
  }
  return info;
});

const logFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.align(),
  // winston.format.json(),
  // winston.format.errors(),
  winston.format.splat(), // Necessary to produce the 'meta' attribute
  errorStackTracerFormat(),
  winston.format.simple(),
  winston.format.printf(info => `${info.timestamp}  ${info.message}`)
);

winston.loggers.add('CustomLogger', {
  format: logFormat,
  transports: [
    new winstonDailyRotateFile({
      filename: './logs/%DATE%.log',
      datePattern: 'MM-DD-YYYY',
      level: 'info'
    }),
    new winstonDailyRotateFile({
      filename: './logs/%DATE%.error.log',
      datePattern: 'MM-DD-YYYY',
      level: 'error'
    }),
    new winstonDailyRotateFile({
      filename: './logs/%DATE%.warn.log',
      datePattern: 'MM-DD-YYYY',
      level: 'warn'
    }),
    new winston.transports.Console({
      level: 'info'
    })
  ],
  exitOnError: false, // do not exit on handled exceptions
});

let logger = winston.loggers.get('CustomLogger');

logger.info(JSON.stringify({ msg: 'hello' }));
logger.error('Error occured');
logger.warn('Warning');
module.exports = logger;

