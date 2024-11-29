const { netmedsScrapper } = require("../utils/pharmacies/netmedsScrapper");
const { oneMgScrapper } = require("../utils/pharmacies/oneMgScrapper");
const { pharmEasyScrapper } = require("../utils/pharmacies/pharmEasyScrapper");
const puppeteer = require("puppeteer");

async function getMedicines(req, res) {
  const { medicine } = req.query;

  console.time("startTime");
  const result = await Promise.all([
    oneMgScrapper(medicine),
    pharmEasyScrapper(medicine),
    netmedsScrapper(medicine),
  ]);
  // await oneMgScrapper(medicine, browser);
  // const result = await pharmEasyScrapper(medicine, browser2);
  console.timeEnd("startTime");
  res.send(result);
}

module.exports = {
  getMedicines,
};
