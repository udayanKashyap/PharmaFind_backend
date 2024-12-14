
const { netmedsScrapper } = require("../utils/pharmacies/netmedsScrapper");
const { oneMgScrapper } = require("../utils/pharmacies/oneMgScrapper");
const { pharmEasyScrapper } = require("../utils/pharmacies/pharmEasyScrapper");

async function getMedicines(req, res) {
  const { medicine } = req.query;

  console.time("startTime");
  let result = await Promise.all([
    oneMgScrapper(medicine),
    pharmEasyScrapper(medicine),
    netmedsScrapper(medicine),
  ]);
  result = sort_by_price(result.flat(), "ascending");
  console.timeEnd("startTime");
  res.send(result);
}

/**
 * Returns the array after sorting it according to the price
 * @param {list} array - the list to be sorted
 * @param {string} order - "ascending" or "descending" the order which is needed
 * @returns {list} - sorted list
 */
function sort_by_price(array, order) {
  return array.sort((a, b) => {
    const priceA = parseFloat(a.price);
    const priceB = parseFloat(b.price);
    if (order == "ascending") {
      return priceA - priceB;
    }
    if (order == "descending") {
      return priceB - priceA;
    }
  });
}

module.exports = {
  getMedicines,
};
