const puppeteer = require("puppeteer");

const scrap_oneMg = async (medicine) => {
  const url = `https://www.1mg.com/search/all?name=${medicine}&filter=true&sort=price_low`;
  console.log(url);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const allMedicines = await page.evaluate(() => {
    const medicines = document.querySelectorAll(".style__container___cTDz0");
    return Array.from(medicines).map((item) => {
      const priceElement = item.querySelector(".style__price-tag___B2csA");
      const linkElement = item.querySelector("a");
      return {
        link: linkElement ? linkElement.href : null,
        priceElement: priceElement ? priceElement.textContent : null,
      };
    });
  });
  // console.log("Medicines: ", allMedicines);
  await browser.close();
  return allMedicines;
};

module.exports = {
  scrap_oneMg,
};
