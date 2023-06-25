const logger = require("./logger");

const p1Handler = (e) => {
  logger.error("This is p1 error, notifying all...", e);
};

const p2Handler = (e) => {
  logger.error("This is p2 error, notifying some...", e);
};

const p3Handler = (e) => {
  logger.error("This is p3 error, notifying minority...", e);
};

module.exports = {
  p1Handler,
  p2Handler,
  p3Handler,
};
