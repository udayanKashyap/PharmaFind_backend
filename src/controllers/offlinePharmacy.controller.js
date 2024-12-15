const db = require("../db/prisma.js");

const registerPharmacy = async (req, res) => {
  const {
    name,
    location,
    home_delivery_locations,
    contact_no,
    email,
    license_no,
  } = req.body;

  const newPharmacy = await db.pharmacy.create({
    data: {
      name,
      location,
      home_delivery_locations,
      contact_no,
      email,
      license_no,
    },
  });

  if (!newPharmacy) {
    console.log(`error in registering the pharmacy`);
    return res.status(500).json({ error: "Registration Failed" });
  }
  res
    .status(201)
    .json({ message: " Pharmacy Registered Successfully", newPharmacy });
};

const getMedicine = async (req, res) => {
  const { name, location } = req.body;

  try {
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

    if (!pharmacies || pharmacies.length === 0) {
      return res
        .status(404)
        .json({ message: "No pharmacies found in the given location." });
    }

    const product = await db.product.findFirst({
      where: {
        name: {
          contains: name,
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

    if (!product) {
      return res
        .status(404)
        .json({ message: "No product found with the given name." });
    }

    const medicines = await db.inventory.findMany({
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

    if (!medicines || medicines.length === 0) {
      return res.status(404).json({
        message:
          "No medicines found in the inventory for the given product and location.",
      });
    }

    res.status(200).json({
      message: "Medicines fetched successfully",
      medicines,
    });
  } catch (error) {
    console.error("Error fetching medicines:", error);
    res.status(500).json({
      message: "An error occurred while fetching medicines.",
      error: error.message || error,
    });
  }
};

const addMedicine = async (req, res) => {
  const { name, manufacturer, expiry, manufactured, qty, price, pharmacyId } =
    req.body;

  try {
    const medicine = await db.product.create({
      data: {
        name,
        manufacturer,
        expiry: expiry ? new Date(expiry) : null,
        manufactured: manufactured ? new Date(manufactured) : null,
      },
    });

    const inventory = await db.inventory.create({
      data: {
        productId: medicine.id,
        pharmacyId,
        price,
        quantity: qty,
      },
    });

    res.status(201).json({
      message: "Medicine added successfully",
      product: medicine,
      inventory,
    });
  } catch (error) {
    console.error("Error in addMedicine:", error);

    res.status(500).json({
      message: "An error occurred while adding the medicine",
      error: error.message || error,
    });
  }
};

const getAllMedicine = async (req, res) => {
  const medicines = await db.inventory.findMany({
    where: {
      pharmacyId: parseInt(pharmacyId),
    },
    include: {
      Product: true,
      Pharmacy: true,
    },
  });

  if (!medicines.length) {
    return res
      .status(404)
      .json({ error: "No medicines found for this pharmacy" });
  }

  res.json(medicines);
};

module.exports = {
  registerPharmacy,
  getMedicine,
  addMedicine,
  getAllMedicine,
};

