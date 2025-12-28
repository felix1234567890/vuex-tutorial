const { chromium } = require('playwright');

(async () => {
  // Launch the browser
  const browser = await chromium.launch({
    headless: false // Set to true for headless mode
  });
  
  // Create a new page
  const page = await browser.newPage();
  
  try {
    // Navigate to the application
    console.log('Navigating to the application...');
    await page.goto('http://localhost:5174/');
    
    // Wait for the page to load
    console.log('Waiting for the page to load...');
    await page.waitForSelector('h1');
    
    // Take a screenshot
    console.log('Taking a screenshot...');
    await page.screenshot({ path: 'app-screenshot.png' });
    
    console.log('Screenshot saved as app-screenshot.png');
    
    // Check if the main components are loaded
    const title = await page.textContent('h1');
    console.log(`Page title: ${title}`);
    
    const productList = await page.$$('.product-card');
    console.log(`Found ${productList.length} products`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close the browser
    await browser.close();
  }
})();
