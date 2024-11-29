const puppeteer = require("puppeteer");

const pharmEasyScrapper = async (medicine) => {
  const url = `https://pharmeasy.in/search/all?name=${medicine}`;
  console.log(url);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  // await page.screenshot({
  //   path: "hn.png",
  // });
  const medicineList = await page.evaluate(() => {
    const medicines = document.querySelectorAll(".Search_medicineLists__hM5Hk");
    return Array.from(medicines)
      .splice(0, 3)
      .map((item) => {
        const nameElement = item.querySelector(
          ".ProductCard_medicineName__8Ydfq",
        );
        const linkElement = item.querySelector("a");
        let priceElement = item.querySelector(".ProductCard_ourPrice__yDytt");
        if (priceElement == null) {
          priceElement = item
            .querySelector(".ProductCard_gcdDiscountContainer__CCi51")
            .querySelector("span");
        }
        const imageElement = item.querySelector(
          ".ProductCard_productImage__dq5lq",
        );
        const packSizeElement = item.querySelector(
          ".ProductCard_measurementUnit__hsZ2o",
        );
        const deliveryElement = null;
        return {
          name: nameElement ? nameElement.innerText : null,
          link: linkElement ? linkElement.href : null,
          price: priceElement ? priceElement.textContent : null,
          image: imageElement ? imageElement.src : null,
          packSize: packSizeElement ? packSizeElement.innerText : null,
          deliveryDate: deliveryElement ? deliveryElement.innerText : null,
          pharmacy: "pharmEasy",
        };
      });
  });

  // console.log("Medicines: ", await allMedicines);
  await browser.close();
  return medicineList;
};

module.exports = {
  pharmEasyScrapper,
};
