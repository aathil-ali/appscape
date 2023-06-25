const logger = require("./logger");

/**
 * @description Handle all errors happenned in the express server
 * @param {*} err Express error
 * @param {import('express').Request} req Express request
 * @param {import('express').Response} res Express response
 * @param {import('express').NextFunction} next Express next function
 */
const expressErrorHandler = async (err, req, res, next) => {
  logger.error("Error occurred in API server", err);

  // send internal server error if error is unknown
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: err,
  });
};

module.exports = {
  expressErrorHandler,
};
