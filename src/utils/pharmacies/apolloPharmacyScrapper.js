const puppeteer = require("puppeteer");

const apolloPharmacyScrapper = async (medicine) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url = `https://www.apollopharmacy.in/search-medicines/${medicine}`;
  await page.goto(url);

  const medicineList = await page.evaluate(async () => {
    const medicines = document.querySelectorAll(
      ".ProductCard_productCardGrid__NHfRH",
    );
    return Array.from(medicines)
      .splice(0, 3)
      .map((item) => {
        const nameElement = item.querySelectorAll(".Gb")[0];
        const linkElement = item.querySelector("a");
        const priceElement = item.querySelector(".sX");
        const imageElement = item.querySelector(".jX")?.querySelector("img");
        const packSizeElement = item.querySelectorAll(".Gb")[1];
        const deliveryElement = null;

        return {
          name: nameElement ? nameElement.innerText : null,
          link: linkElement ? linkElement.href : null,
          price: priceElement ? priceElement.innerText : null,
          image: imageElement ? imageElement.src : null,
          packSize: packSizeElement ? packSizeElement.innerText : null,
          deliveryDate: deliveryElement ? deliveryElement : null,
          pharmacy: "apolloPharmacy",
        };
      });
  });
  console.log("Medicine List apollopharmacy: ", medicineList);
  await browser.close();
  return medicineList;
};

module.exports = {
  apolloPharmacyScrapper,
};
