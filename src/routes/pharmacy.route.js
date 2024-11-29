const express = require("express");
// const {
//   getMedicinesOneMG,
// } = require("../controllers/pharmacies/oneMG.controller");
// const {
//   getMedicinesPharmEasy,
// } = require("../controllers/pharmacies/pharmEasy.controller");
//
const { getMedicines } = require("../controllers/pharmacy.controller");
const router = express.Router();

// router.get("/oneMg/", getMedicinesOneMG);
// router.get("/pharmEasy/", getMedicinesPharmEasy);
router.get("/all/", getMedicines);

module.exports = router;
