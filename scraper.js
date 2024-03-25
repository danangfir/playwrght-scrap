const { chromium } = require('playwright');

(async () => {
  try {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://bachacoffee.com/en/coffee-beans', { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('.product-listing__coffee--body', { state: 'attached' });
    
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000); // Beri waktu untuk konten dimuat setelah scroll

    const outerElements = await page.$$('.product-listing__coffee--body');

    console.log(`Found ${outerElements.length} outer elements.`);

    for (const outerElement of outerElements) {
      const innerElement1 = await outerElement.$('.product-listing__coffee--name');
      const innerElement2 = await outerElement.$('.price--block__number');

      const text1 = await innerElement1.textContent();
      const text2 = await innerElement2.textContent();

      console.log({ text1: text1.trim(), text2: text2.trim() });
    }

    await browser.close();
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
  }
})();

