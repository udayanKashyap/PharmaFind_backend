const {
  scrap_pharmEasy: pharmEasyScrapper,
} = require("../../utils/pharmacies/pharmEasyScrapper");

async function getMedicinesPharmEasy(req, res) {
  const { medicine } = req.query;
  const medicineList = await pharmEasyScrapper(medicine);
  console.log(medicineList);
  res.send(medicineList);
}

module.exports = {
  getMedicinesPharmEasy,
};
