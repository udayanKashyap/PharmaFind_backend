const express = require("express");
const {
  getMedicinesOneMG,
} = require("../controllers/pharmacies/oneMG.controller");
const {
  getMedicinesPharmEasy,
} = require("../controllers/pharmacies/pharmEasy.controller");
const router = express.Router();

router.get("/oneMg/", getMedicinesOneMG);
router.get("/pharmEasy/", getMedicinesPharmEasy);

module.exports = router;
