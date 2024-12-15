const catchAsync = require("../utils/errorHandler");
const { netmedsScrapper } = require("../utils/pharmacies/netmedsScrapper");
const { oneMgScrapper } = require("../utils/pharmacies/oneMgScrapper");
const { pharmEasyScrapper } = require("../utils/pharmacies/pharmEasyScrapper");
const db = require("../db/prisma.js");
const bloom = require("../utils/forbiddenMedicine.js")

const getMedicines = catchAsync(async (req, res) => {
  const { medicine, location, userId } = req.query;

  if (bloom.has(medicine.toLowerCase())) {
    return res.status(400).send({
      message: `${medicine} is a forbidden medicine and cannot be searched.`,
    });
  }

  const searchEntry = await db.search.create({
    data: {
      query: medicine,
      location: location,
      userId: userId ? parseInt(userId) : null,
    },
  });

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
    netmedsScrapper(medicine),
  ]);
  result = sort_by_price(result.flat(), "ascending");
  res.send({
    searchId: searchEntry.id,
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
