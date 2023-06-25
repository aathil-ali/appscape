const express = require("express");
const router = express.Router();


const hubspotRouter = require("./hubspot");

router.get("/", async (req, res) => {
  return res.render("index");
});

router.use("/hubspot",hubspotRouter);


module.exports = router;
