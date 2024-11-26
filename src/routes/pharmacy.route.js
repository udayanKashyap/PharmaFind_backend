const express = require("express");
const { getMedicines } = require("../controllers/pharmacies/oneMG.controller");
const router = express.Router();

router.get("/", getMedicines);

module.exports = router;
