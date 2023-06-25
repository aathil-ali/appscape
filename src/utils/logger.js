const path = require("path");
const pino = require("pino");
const config = require("config");

const isProduction = config.get("NODE_ENV") === "production";

// get date to have day based log files
const date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
let currentDate = `${day}_${month}_${year}`;

// pretty print only for development
const prettyLogger = isProduction
  ? []
  : [
      {
        target: "pino-pretty",
      },
    ];

// @ts-ignore
const pinoInstance = pino({
  transport: {
    targets: [
      ...prettyLogger,
      // file logger
      {
        target: "pino/file",

        options: {
          destination: path.resolve(
            __dirname,
            "..",
            "..",
            "logs",
            `log_${currentDate}.log`
          ),
        },
      },
    ],
  },
});

const logTransformer =
  (level = "info") =>
  (msg, ...args) => {
    const argsBuilder = args.length
      ? {
          metadata: {},
          [level]: {
            message: args[0].message,
            content: args,
          },
        }
      : {};

    pinoInstance[level](argsBuilder, msg);
  };

/**
 * @description Application wide logger which uses Pino Logger underneath @see {@link https://getpino.io | Pino}
 * @example
 * Usage examples
 * // info
 * logger.info("This is a response from the API call", response)
 * // error
 * logger.error("This is an error from the API call", error)
 * // debug
 * logger.debug("This is a debug log", debugValue)
 * // trace
 * logger.trace("This is a trace log", errorTrace)
 */
const logger = {
  info: logTransformer(),
  error: logTransformer("error"),
  debug: logTransformer("debug"),
  trace: logTransformer("trace"),
};

module.exports = logger;
