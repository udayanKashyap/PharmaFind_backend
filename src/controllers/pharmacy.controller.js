const { PrismaClient } = require("@prisma/client");
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
  const search_record = await store_search(medicine);
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

/**
 * Stores the search query int the database
 * @param {string} query - The search query provided by the user
 * @returns - The datbase object that was created
 */
async function store_search(query) {
  const prisma = new PrismaClient();
  const search = await prisma.search.create({
    data: {
      query: query,
    },
  });
  return search;
}

module.exports = {
  getMedicines,
};
