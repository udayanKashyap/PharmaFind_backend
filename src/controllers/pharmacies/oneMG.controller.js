const { scrap_oneMg } = require("../../utils/pharmacies/oneMgScrapper.js");

async function getMedicines(req, res) {
  const { medicine } = req.query;
  // console.log("medicine name: ", medicine);
  const medicineList = await scrap_oneMg(medicine);
  res.send(medicineList);
}

module.exports = {
  getMedicines,
};
