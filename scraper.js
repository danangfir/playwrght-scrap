const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://bachacoffee.com/en/coffee-beans', { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('.product-listing__coffee--body', { state: 'attached' });

    await autoScroll(page);

    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await page.waitForTimeout(17000); 
    
    const outerElements = await page.$$('.product-listing__coffee--body');
    console.log(`Found ${outerElements.length} outer elements.`);

    for (const outerElement of outerElements) {
      const innerElement1 = await outerElement.$('.product-listing__coffee--name');
      const innerElement2 = await outerElement.$('.price--block__number');

      const text1 = innerElement1 ? await innerElement1.textContent() : 'Nama produk tidak ditemukan';
      const text2 = innerElement2 ? await innerElement2.textContent() : 'Harga produk tidak ditemukan';

      console.log({ text1: text1.trim(), text2: text2.trim() });
    }

    await browser.close();
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
  }
})();


async function autoScroll(page){
  await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 100; 
          var timer = setInterval(() => {
              var scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if(totalHeight >= scrollHeight){
                  clearInterval(timer);
                  resolve();
              }
          }, 100); 
      });
  });
}
