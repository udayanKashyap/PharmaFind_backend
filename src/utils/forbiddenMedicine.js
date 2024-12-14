const { BloomFilter } = require('bloom-filters');
const forbiddenDrugs = [
    "Rofecoxib",
    "Phenylpropanolamine",
    "Nimesulide for children",
    "Analgin",
    "Cisapride",
    "Rosiglitazone", "Valdecoxib",
    "FDC of Metformin + Fenofibrate",
    "Gatifloxacin",
    "Pioglitazone",
]

const bloom = new BloomFilter(1000, 2)

forbiddenDrugs.forEach((drug) => bloom.add(drug.toLowerCase()))

module.exports = bloom