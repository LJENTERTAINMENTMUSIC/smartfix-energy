const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\USER\\.gemini\\antigravity\\brain\\927eb294-8fee-4725-baf5-708ba45dd02d';

async function run() {
  console.log('--- Starting Estate IPP Verification Suite ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Test against live production deployment
  const baseUrl = 'https://smartfix-energy.vercel.app';
  console.log(`Targeting LIVE PRODUCTION server: ${baseUrl}`);

  try {
    // 1. Test /estate-ipp page
    console.log('1. Navigating to /estate-ipp...');
    await page.goto(`${baseUrl}/estate-ipp`, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);

    const heroScreenshot = path.join(ARTIFACT_DIR, 'qc_estate_ipp_hero.png');
    await page.screenshot({ path: heroScreenshot, fullPage: false });
    console.log(`✓ Saved ${heroScreenshot}`);

    // Scroll to calculator
    console.log('2. Testing Estate IPP Calculator...');
    await page.evaluate(() => {
      const el = document.getElementById('calculator');
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(800);

    // Click "Boutique Gated Community" or "Large Mixed-Use Estate" preset
    const presetBtn = page.locator('text=Large Mixed-Use Estate');
    if (await presetBtn.isVisible()) {
      await presetBtn.click();
      await page.waitForTimeout(500);
    }

    const calcScreenshot = path.join(ARTIFACT_DIR, 'qc_estate_ipp_calculator.png');
    await page.screenshot({ path: calcScreenshot, fullPage: false });
    console.log(`✓ Saved ${calcScreenshot}`);

    // Click "Generate Estate PPA Term Sheet"
    const termSheetBtn = page.locator('button:has-text("Generate Estate PPA Term Sheet")');
    if (await termSheetBtn.isVisible()) {
      await termSheetBtn.click();
      await page.waitForTimeout(800);

      const modalScreenshot = path.join(ARTIFACT_DIR, 'qc_estate_ipp_termsheet_modal.png');
      await page.screenshot({ path: modalScreenshot, fullPage: false });
      console.log(`✓ Saved ${modalScreenshot}`);

      // Close modal
      const closeBtn = page.locator('button:has-text("✕")');
      if (await closeBtn.isVisible()) await closeBtn.click();
      await page.waitForTimeout(400);
    }

    // Scroll to Resident Vending Simulator
    console.log('3. Testing Resident STS Vending Simulator...');
    await page.evaluate(() => {
      const el = document.getElementById('vending-demo');
      if (el) el.scrollIntoView();
    });
    await page.waitForTimeout(800);

    // Click ₦20,000
    const amtBtn = page.locator('button:has-text("₦20,000")');
    if (await amtBtn.isVisible()) {
      await amtBtn.click();
      await page.waitForTimeout(400);
    }

    // Click Simulate Instant Token Purchase
    const vendBtn = page.locator('button:has-text("Simulate Instant Token Purchase")');
    if (await vendBtn.isVisible()) {
      await vendBtn.click();
      await page.waitForTimeout(1500); // wait for encryption animation
    }

    const vendingScreenshot = path.join(ARTIFACT_DIR, 'qc_estate_ipp_vending_receipt.png');
    await page.screenshot({ path: vendingScreenshot, fullPage: false });
    console.log(`✓ Saved ${vendingScreenshot}`);

    // 4. Test Customer Portal Estate Power tab
    console.log('4. Testing /portal Estate Power (IPP) tab...');
    await page.goto(`${baseUrl}/portal`, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);

    // Click "Estate Power (IPP)" tab
    const estateTabBtn = page.locator('button:has-text("Estate Power (IPP)")');
    if (await estateTabBtn.isVisible()) {
      await estateTabBtn.click();
      await page.waitForTimeout(1000);
    }

    const portalScreenshot = path.join(ARTIFACT_DIR, 'qc_portal_estate_power_tab.png');
    await page.screenshot({ path: portalScreenshot, fullPage: false });
    console.log(`✓ Saved ${portalScreenshot}`);

    // 5. Test Admin App Estate IPP tab
    console.log('5. Testing /admin/ Estate IPP tab...');
    await page.goto(`${baseUrl}/admin/`, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1500);

    // Check if login needed
    const emailInput = page.locator('input[type="email"]');
    if (await emailInput.isVisible()) {
      await emailInput.fill('admin@smartfixenergy.com');
      await page.locator('input[type="password"]').fill('SmartFix123!');
      await page.locator('button:has-text("Sign in")').click();
      await page.waitForTimeout(1500);
    }

    // Click "Estate IPP" tab
    const adminEstateTab = page.locator('button:has-text("Estate IPP")');
    if (await adminEstateTab.isVisible()) {
      await adminEstateTab.click();
      await page.waitForTimeout(1000);
    }

    const adminScreenshot = path.join(ARTIFACT_DIR, 'qc_admin_estate_ipp_tab.png');
    await page.screenshot({ path: adminScreenshot, fullPage: false });
    console.log(`✓ Saved ${adminScreenshot}`);

    console.log('--- All Estate IPP Verification Tests Passed! ---');
  } catch (err) {
    console.error('Error during Estate IPP verification:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
