const bloom = require('../utils/forbiddenMedicine')
const checkForbiddenMed = (req, res, next) => {
    const medicine = req.body.name

    if (!medicine) {
        console.log("middleware used in different api")
        next()
    }

    const isForbidden = bloom.has(medicine.toLowerCase())

    if (isForbidden) {
        return res.status(403).json({ message: "The drug you searched for might be forbidden. Please consult regulatory guidelines." })
    }

    next();
}

module.exports = checkForbiddenMed;
