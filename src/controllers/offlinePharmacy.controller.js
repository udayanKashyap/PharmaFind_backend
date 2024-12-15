const db = require("../db/prisma.js");

const registerPharmacy = async (req, res) => {
    const { name, location, contact_no, email, license_no } = req.body;

    const newPharmacy = await db.pharmacy.create({
        data: {
            name,
            location,
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
    getAllMedicine,
};
