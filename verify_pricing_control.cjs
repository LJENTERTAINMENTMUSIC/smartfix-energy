const { chromium } = require('playwright');
const path = require('path');

async function run() {
  console.log('--- Starting Admin Pricing Control Verification ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  let baseUrl = 'http://127.0.0.1:4173';
  console.log(`Testing against preview server: ${baseUrl}`);

  // 1. Visit Admin Login
  console.log(`1. Navigating to ${baseUrl}/admin/...`);
  await page.goto(`${baseUrl}/admin/`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // If login form present, login
  const emailInput = page.locator('input[type="email"]');
  if (await emailInput.isVisible()) {
    console.log('Logging into admin...');
    await emailInput.fill('admin@smartfixenergy.com');
    await page.locator('input[type="password"]').fill('SmartFix123!');
    await page.locator('button:has-text("Sign in")').click();
    await page.waitForTimeout(3000);
  }

  // 2. Click on Pricing Control tab
  console.log('2. Clicking on Pricing Control tab...');
  const pricingTabBtn = await page.getByRole('button', { name: /Pricing Control/i }).first();
  if (pricingTabBtn) {
    await pricingTabBtn.click();
    await page.waitForTimeout(1500);
    console.log('✓ Successfully switched to Pricing Control tab');
  } else {
    console.error('✗ Pricing Control tab button not found');
  }

  // 3. Take screenshot of Pricing Control Center
  const artifactDir = 'C:/Users/USER/.gemini/antigravity/brain/927eb294-8fee-4725-baf5-708ba45dd02d';
  const screenshotPath = path.join(artifactDir, 'qc_admin_pricing_control.png');
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`✓ Screenshot captured at ${screenshotPath}`);

  // 4. Test clicking "Change Log" button
  const changeLogBtn = await page.getByRole('button', { name: /Change Log/i }).first();
  if (changeLogBtn) {
    console.log('Clicking Change Log button...');
    await changeLogBtn.click();
    await page.waitForTimeout(500);
  }

  // 5. Test opening the edit modal for AGO Diesel
  console.log('5. Testing Price Edit Modal...');
  const editButtons = await page.$$('button[title="Edit Price"]');
  if (editButtons.length > 0) {
    await editButtons[0].click();
    await page.waitForTimeout(1000);
    const editModalScreenshot = path.join(artifactDir, 'qc_admin_price_edit_modal.png');
    await page.screenshot({ path: editModalScreenshot });
    console.log(`✓ Price Edit modal screenshot captured at ${editModalScreenshot}`);

    // Close modal
    const closeBtn = await page.getByRole('button', { name: 'Cancel' }).first();
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(500);
  }

  // 6. Test the Fuel Page Live Rate Banner
  console.log('6. Navigating to Fuel page...');
  await page.goto(`${baseUrl}/fuel`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const fuelScreenshot = path.join(artifactDir, 'qc_public_fuel_pricing_banner.png');
  await page.screenshot({ path: fuelScreenshot });
  console.log(`✓ Public Fuel page screenshot captured at ${fuelScreenshot}`);

  // 7. Test Customer Portal Fuel Order Modal
  console.log('7. Navigating to Customer Portal...');
  await page.goto(`${baseUrl}/portal`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const orderFuelBtn = await page.getByRole('button', { name: /Order Fuel/i }).first();
  if (orderFuelBtn) {
    await orderFuelBtn.click();
    await page.waitForTimeout(1000);
    const portalOrderModalScreenshot = path.join(artifactDir, 'qc_portal_order_fuel_modal_pricing.png');
    await page.screenshot({ path: portalOrderModalScreenshot });
    console.log(`✓ Customer Portal Order Fuel Modal screenshot captured at ${portalOrderModalScreenshot}`);
  }

  await browser.close();
  console.log('--- Verification Complete ---');
}

run().catch((err) => {
  console.error('Error running verification:', err);
  process.exit(1);
});
