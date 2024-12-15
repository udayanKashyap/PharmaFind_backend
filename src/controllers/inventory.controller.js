const db = require("../db/prisma.js");
const catchAsync = require("../utils/errorHandler.js");

const addMedicine = async (req, res) => {
    const { pharmacyId } = req.user;
    const { name, manufacturer, expiry, manufactured, qty, price } =
        req.body;


    if (!pharmacyId) {
        return res.status(401).json({
            status: 'fail',
            message: 'unauthorized request',
        });
    }

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

const getInventory = catchAsync(async (req, res) => {
    const { pharmacyId } = req.user;

    if (!pharmacyId) {
        return res.status(401).json({
            status: 'fail',
            message: 'unauthorized request',
        });
    }

    const inventory = await db.inventory.findMany({
        where: { pharmacyId: parseInt(pharmacyId) },
        include: {
            Product: true,
        },
    });

    if (!inventory.length) {
        return res.status(200).json({
            message: 'No inventory found for the specified pharmacy.',
        });
    }

    res.status(200).json({
        status: 'success',
        data: inventory,
    });

})

const updateInventory = catchAsync(async (req, res) => {
    const { pharmacyId } = req.user
    const { productId, qty, price } = req.body

    if (!pharmacyId) {
        return res.status(401).json({
            status: 'fail',
            message: 'unauthorized request',
        });
    }

    if (!productId) {
        return res.status(400).json({
            status: 'fail',
            message: 'Product ID and Pharmacy ID are required.',
        });
    }

    const inventory = await db.inventory.findFirst({
        where: {
            productId: parseInt(productId),
            pharmacyId: parseInt(pharmacyId),
        },
    });

    if (!inventory) {
        return res.status(404).json({
            status: 'fail',
            message: 'Inventory record not found for the specified product and pharmacy.',
        });
    }

    const updatedInventory = await db.inventory.update({
        where: {
            id: inventory.id,
        },
        data: {
            quantity: qty !== undefined ? parseInt(qty) : inventory.quantity,
            price: price !== undefined ? parseFloat(price) : inventory.price,
        },
    });

    res.status(200).json({
        status: 'success',
        message: 'Inventory updated successfully.',
        data: updatedInventory,
    });
})

module.exports = { addMedicine, getInventory, updateInventory }