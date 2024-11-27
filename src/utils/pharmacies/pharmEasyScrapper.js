const puppeteer = require("puppeteer");

const pharmEasyScrapper = async (medicine) => {
  const url = `https://pharmeasy.in/search/all?name=${medicine}`;
  console.log(url);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.screenshot({
    path: "hn.png",
  });
  const allMedicines = await page.evaluate(() => {
    const medicines = document.querySelectorAll(".Search_medicineLists__hM5Hk");
    return Array.from(medicines).map((item) => {
      const linkElement = item.querySelector("a");
      return {
        link: linkElement ? linkElement.href : null,
      };
    });
  });

  // console.log("Medicines: ", await allMedicines);
  await browser.close();
  return allMedicines;
};

module.exports = {
  scrap_pharmEasy: pharmEasyScrapper,
};
