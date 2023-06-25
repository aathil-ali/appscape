const logger = require("../utils/logger");
const config = require("config");

const port = process.env.PORT;
var cors = require("cors");

/**
 * @description Bootstraps the application
 * @param {import('express').Express} server Express app instance
 */
const bootstrapApplication = async (server) => {
  try {
    // get app modules to setup the application


    // start server
    server.listen(port, () => {
      logger.info(`🚀 Server listening on port ${port}`);

      try {
        // start the process
        server.use(cors());
        server.use(function (req, res, next) {
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
          next();
        });

      } catch (error) {
        logger.error("Error occurred in script setup", error);
      }
    });

    // enable graceful shutdown
  } catch (error) {
    logger.error("Error happened while bootstrapping the application", error);
  }
};

module.exports = bootstrapApplication;
