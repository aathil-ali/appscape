const express = require("express");
const router = express.Router();
const {verifyToken} = require('../middleware/throttle');

const {
    oauthCallBack,
} = require("../controllers/hubspot");

/* Get auth */
router.get("/install", oauthCallBack);

module.exports = router;



