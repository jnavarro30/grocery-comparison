import puppeteer from "puppeteer";
import stores from "./stores.js";

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(stores.albertsons);
  await page.waitForSelector("title");

  await page.locator("#skip-main-content").fill("bananas");
  await page.keyboard.press("Enter");
  await page.waitForNavigation();

  await page.waitForSelector("div[data-qa='srch-grd-pd']");

  const allImages = await page.$$eval("div.product-card-container", images => {
    return images.map(image => {
      const imageUrl = image.querySelector(
        ".product-card-container__product-image"
      );
      const name = image.querySelector(".product-title__name");
      const price = image.querySelector(".product-price__saleprice");

      const text = price.innerText;
      // const source = productImage.src;
      const formatPrice = text.match(/\d+.\d+/)[0];
      // return `${format} / each - ${txt} ${source}`;
      return {
        item: name.innerText,
        price: formatPrice,
        imageUrl: imageUrl.src,
      };
    });
  });

  const sortedImages = allImages
    .sort((a, b) => {
      let regex = /\d+.\d+/;
      return a.price.match(regex)[0] - b.price.match(regex)[0];
    })
    .slice(0, 5);

  console.log(sortedImages);

  // await page.screenshot({ path: "./screenshots/store.jpg" });
  await browser.close();
})();
