const {
  scrap_oneMg: oneMgScrapper,
} = require("../../utils/pharmacies/oneMgScrapper.js");

async function getMedicinesOneMG(req, res) {
  const { medicine } = req.query;
  // console.log("medicine name: ", medicine);
  const medicineList = await oneMgScrapper(medicine);
  res.send(medicineList);
}

module.exports = {
  getMedicinesOneMG,
};
