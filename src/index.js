const express = require("express");
const bootstrapApplication = require("./bootstrap/app");
const { expressErrorHandler } = require("./utils/error-handlers");

// create express app
const server = express();

// register handlebars template engine
server.set("view engine", "html");
server.engine("html", require("hbs").__express);

// register all routes
server.use("/", require("./routes"));

// global express error handler
server.use(expressErrorHandler);

// bootstrap the application
bootstrapApplication(server);
