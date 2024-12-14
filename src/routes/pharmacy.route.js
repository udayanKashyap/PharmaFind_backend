const express = require("express");
const catchAsync = require("../utils/errorHandler");
const { getMedicines } = require("../controllers/pharmacy.controller");
const router = express.Router();

// router.get("/oneMg/", getMedicinesOneMG);
// router.get("/pharmEasy/", getMedicinesPharmEasy);
router.get("/all/", catchAsync(getMedicines));

module.exports = router;
