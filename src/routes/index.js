const express = require("express");
const router = express.Router();
require("dotenv").config();

const hubspotRouter = require("./hubspot");

router.get("/", async (req, res) => {
  console.log("------App listening-------------",process.env.APP_ID)
  return res.render("index");
});

router.use("/hubspot",hubspotRouter);


module.exports = router;
