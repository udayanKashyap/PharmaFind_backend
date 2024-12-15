const jwt = require('jsonwebtoken');
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

    const token = jwt.sign(
        { pharmacyId: newPharmacy.id },
        "pharmaFind",
        { expiresIn: '7d' }
    );

    res.cookie('authToken', token, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
        message: "Pharmacy Registered Successfully",
        newPharmacy,
    });
};


const loginPharmacy = async (req, res) => {
    const { name, license_no } = req.body;

    const pharmacy = await db.pharmacy.findFirst({
        where: {
            name,
            license_no,
        },
    });

    if (!pharmacy) {
        return res.status(401).json({ error: "Invalid name or license number" });
    }

    const token = jwt.sign(
        { pharmacyId: pharmacy.id },
        "pharmaFind",
        { expiresIn: '7d' }
    );

    res.cookie('authToken', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
        message: "Logged in successfully",
        pharmacy,
    });
};

const logoutPharmacy = async (req, res) => {
    try {
        res.clearCookie('authToken', {
            httpOnly: true,
            sameSite: 'strict',
        });

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ error: 'Error during logout' });
    }
}

const getPharmacyDetails = async (req, res) => {
    const { pharmacyId } = req.user;

    try {
        const pharmacy = await db.pharmacy.findUnique({
            where: { id: pharmacyId },
        });

        if (!pharmacy) {
            return res.status(404).json({ error: "Pharmacy not found" });
        }

        res.status(200).json({ pharmacy });
    } catch (error) {
        console.error("Error fetching pharmacy details:", error);
        res.status(500).json({ error: "Error fetching pharmacy" });
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
    getAllMedicine,
    loginPharmacy,
    getPharmacyDetails,
    logoutPharmacy
};
