const puppeteer = require("puppeteer");

const netmedsScrapper = async (medicine) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url = `https://www.netmeds.com/catalogsearch/result/${medicine}/all`;
  await page.goto(url);

  // await page.screenshot({
  //   path: "hn.png",
  // });

  const medicineList = await page.evaluate(async () => {
    const medicines = document.querySelectorAll(".ais-InfiniteHits-item");
    return Array.from(medicines)
      .splice(0, 3)
      .map((item) => {
        const nameElement = item
          .querySelector(".category_name")
          .querySelector(".clsgetname");
        const linkElement = item.querySelector(".category_name");
        const priceElement = item.querySelector(".final-price");
        const imageElement = item
          .querySelector(".category_name")
          .querySelector(".product-image-photo");
        const packSizeElement = null;
        const deliveryElement = null;

        return {
          name: nameElement ? nameElement.innerText : null,
          link: linkElement ? linkElement.href : null,
          price: priceElement ? priceElement.innerText : null,
          image: imageElement ? imageElement.src : null,
          packSize: packSizeElement ? packSizeElement : null,
          deliveryDate: deliveryElement ? deliveryElement : null,
          pharmacy: "netmeds",
        };
      });
  });

  await browser.close();
  return medicineList;
};

module.exports = {
  netmedsScrapper,
};
