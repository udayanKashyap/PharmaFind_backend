const express = require("express");
const { getUser, updateUser } = require("../controllers/user.controller");
const router = express.Router();

router.get("/", getUser);
router.get("/update", updateUser);

module.exports = router;
