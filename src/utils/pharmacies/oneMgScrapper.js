const { PuppeteerError } = require("puppeteer");
const puppeteer = require("puppeteer");

///*
const oneMgScrapper1 = async (medicine) => {
  const url = `https://www.1mg.com/search/all?name=${medicine}&filter=true&sort=price_low`;
  console.log(url);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);

  const allMedicines = await page.evaluate(() => {
    const medicines = document.querySelectorAll(
      ".style__horizontal-card___1Zwmt",
    );
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

const oneMgScrapper = async (medicine) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const url = `https://www.1mg.com/search/all?name=${medicine}&filter=true&sort=price_high`;
  await page.goto(url);

  const medicineList = await page.evaluate(async () => {
    await new Promise((r) => setInterval(r, 1000));
    document.querySelector(".style__main-link-bar___12igi").scrollIntoView();
    await new Promise((r) => setInterval(r, 1000));
    const medicines = document.querySelectorAll(".style__container___cTDz0");
    return Array.from(medicines).map((item) => {
      document
        .querySelector(".style__product-description___1vPQe")
        .scrollIntoView();
      const nameElement = item
        .querySelector(".style__product-description___1vPQe")
        .querySelector("span");
      const priceElement = item.querySelector(".style__price-tag___B2csA");
      const linkElement = item.querySelector("a");
      const imageElement = item.querySelector(".style__image___Ny-Sa");
      return {
        name: nameElement ? nameElement.innerText : null,
        link: linkElement ? linkElement.href : null,
        price: priceElement ? priceElement.textContent : null,
        image: imageElement ? imageElement.src : null,
        pharmacy: "OneMg",
      };
    });
  });
  console.log("Medicines: ", medicineList);

  await page.screenshot({
    path: "bottom.png",
  });
  await browser.close();
  return medicineList;
};

module.exports = {
  oneMgScrapper,
};
