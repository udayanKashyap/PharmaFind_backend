const express = require("express");
const { getMedicines } = require("../controllers/pharmacy.controller");
const {
    registerPharmacy,
    getAllMedicine,
} = require("../controllers/offlinePharmacy.controller");
const { addMedicine, getInventory, updateInventory } = require("../controllers/inventory.controller")
const checkForbiddenMed = require("../middleware/forbiddenMedFilter.middleware");
const router = express.Router();

router.get("/all", getMedicines);
router.post("/registerPharma", registerPharmacy);

router.post("/inventory", addMedicine);
router.get("/inventory", getInventory);
router.post("/updateInventory", updateInventory);

module.exports = router;
