const catchAsync = require("../utils/errorHandler");
const { netmedsScrapper } = require("../utils/pharmacies/netmedsScrapper");
const { oneMgScrapper } = require("../utils/pharmacies/oneMgScrapper");
const { pharmEasyScrapper } = require("../utils/pharmacies/pharmEasyScrapper");
const db = require("../db/prisma.js");

const getMedicines = catchAsync(async (req, res) => {
  const { medicine, location } = req.query;
  const pharmacies = await db.pharmacy.findMany({
    where: {
      location: {
        contains: location,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      location: true,
    },
  });

  const product = await db.product.findFirst({
    where: {
      name: {
        contains: medicine,
        mode: "insensitive",
      },
      expiry: {
        gte: new Date(), // Exclude expired products
      },
    },
    select: {
      id: true,
      name: true,
      manufacturer: true,
    },
  });

  let medicines = [];
  if (pharmacies.length > 0)
    medicines = await db.inventory.findMany({
      where: {
        productId: product.id,
        pharmacyId: {
          in: pharmacies.map((pharmacy) => pharmacy.id),
        },
      },
      select: {
        price: true,
        quantity: true,
        Pharmacy: {
          select: {
            name: true,
            location: true,
          },
        },
        Product: {
          select: {
            name: true,
            manufacturer: true,
          },
        },
      },
    });
  let result = await Promise.all([
    oneMgScrapper(medicine),
    pharmEasyScrapper(medicine),
    // netmedsScrapper(medicine),
  ]);
  result = sort_by_price(result.flat(), "ascending");
  res.send({
    offline: medicines,
    online: result,
  });
});

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
