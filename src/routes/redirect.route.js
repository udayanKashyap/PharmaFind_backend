const express = require("express");
const { storeRedirects } = require("../controllers/redirect.controller");
const router = express.Router();

router.post("/store", storeRedirects);

module.exports = router;
