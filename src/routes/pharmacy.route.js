const express = require("express");
const { getMedicines } = require("../controllers/pharmacy.controller");
const {
    registerPharmacy,
    getAllMedicine,
    loginPharmacy,
    getPharmacyDetails,
    logoutPharmacy
} = require("../controllers/offlinePharmacy.controller");
const { addMedicine, getInventory, updateInventory } = require("../controllers/inventory.controller")
const checkForbiddenMed = require("../middleware/forbiddenMedFilter.middleware");
const { authenticatePharmacy } = require("../middleware/authenticatePharmacy.middleware");

const router = express.Router();

router.get("/all", getMedicines);
router.post("/registerPharma", registerPharmacy);
router.post("/login", loginPharmacy);
router.get("/logout", authenticatePharmacy, logoutPharmacy)
router.get("/me", authenticatePharmacy, getPharmacyDetails);

router.post("/inventory", authenticatePharmacy, addMedicine);
router.get("/inventory", authenticatePharmacy, getInventory);
router.post("/updateInventory", authenticatePharmacy, updateInventory);

module.exports = router;
