const express = require("express");
const catchAsync = require("../utils/errorHandler");
const { getMedicines } = require("../controllers/pharmacy.controller");
const {
  registerPharmacy,
  getMedicine,
  addMedicine,
  getAllMedicine,
} = require("../controllers/offlinePharmacy.controller");
const checkForbiddenMed = require("../middleware/forbiddenMedFilter.middleware");
const router = express.Router();

router.get("/all/", getMedicines);
router.post("/registerPharma", registerPharmacy);
router.get("/medicine", checkForbiddenMed, getMedicine);
router.post("/medicine/add", addMedicine);
router.get("/medicine/all", getAllMedicine);

module.exports = router;
