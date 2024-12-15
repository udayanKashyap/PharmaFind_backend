const { PrismaClient } = require("@prisma/client");

async function storeRedirects(req, res) {
  const { search_id, url } = req.body;

  const prisma = new PrismaClient();
  const result = await prisma.redirect.create({
    data: {
      url: url,
      searchId: search_id,
    },
  });
  res.status(201).send(result);
}

module.exports = {
  storeRedirects,
};
