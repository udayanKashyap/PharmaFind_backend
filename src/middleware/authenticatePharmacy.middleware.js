const jwt = require('jsonwebtoken');

const authenticatePharmacy = (req, res, next) => {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, "pharmaFind");

        req.user = { pharmacyId: decoded.pharmacyId };

        next();
    } catch (err) {
        return res.status(403).json({ error: "Forbidden: Invalid token" });
    }
};

module.exports = { authenticatePharmacy };