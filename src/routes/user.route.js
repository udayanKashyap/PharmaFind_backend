const express = require("express");
const {
  getUser,
  updateUser,
  adduser,
} = require("../controllers/user.controller");
const router = express.Router();

router.post("/", adduser);
router.get("/", getUser);
router.get("/update", updateUser);

module.exports = router;
