const { chromium } = require('playwright');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/USER/.gemini/antigravity/brain/927eb294-8fee-4725-baf5-708ba45dd02d';

async function run() {
  console.log('--- Starting New Energy Suite QC Verification ---');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const baseUrl = 'http://127.0.0.1:4173';

  // 1. Verify Energy Calculator Page
  console.log('1. Testing /calculator page...');
  await page.goto(`${baseUrl}/calculator`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const calcScreenshot = path.join(ARTIFACT_DIR, 'qc_energy_calculator_page.png');
  await page.screenshot({ path: calcScreenshot, fullPage: true });
  console.log(`✓ Saved ${calcScreenshot}`);

  // Test opening proposal modal on calculator
  const quoteBtn = await page.getByRole('button', { name: /Generate Feasibility Pack & Quote/i }).first();
  if (quoteBtn) {
    console.log('Clicking Generate Feasibility Pack button...');
    await quoteBtn.click();
    await page.waitForTimeout(1000);
    const modalScreenshot = path.join(ARTIFACT_DIR, 'qc_calculator_proposal_modal.png');
    await page.screenshot({ path: modalScreenshot });
    console.log(`✓ Saved ${modalScreenshot}`);

    const closeBtn = await page.getByRole('button', { name: /Close/i }).first();
    if (closeBtn) await closeBtn.click();
    await page.waitForTimeout(500);
  }

  // 2. Verify Customer Portal: Telemetry & Live GPS Tracker
  console.log('2. Testing /portal overview tab (Telemetry & GPS Tracker)...');
  await page.goto(`${baseUrl}/portal`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  const telemetryScreenshot = path.join(ARTIFACT_DIR, 'qc_portal_tank_telemetry.png');
  await page.screenshot({ path: telemetryScreenshot });
  console.log(`✓ Saved ${telemetryScreenshot}`);

  // Test signing e-POD
  const podBtn = await page.getByRole('button', { name: /Verify Flowmeter & Sign Electronic POD/i }).first();
  if (podBtn) {
    console.log('Testing e-POD verification modal...');
    await podBtn.click();
    await page.waitForTimeout(1000);
    const epodModalScreenshot = path.join(ARTIFACT_DIR, 'qc_portal_epod_modal.png');
    await page.screenshot({ path: epodModalScreenshot });
    console.log(`✓ Saved ${epodModalScreenshot}`);

    // Click confirm
    const confirmPodBtn = await page.getByRole('button', { name: /Certify & Sign Electronic POD/i }).first();
    if (confirmPodBtn) {
      await confirmPodBtn.click();
      await page.waitForTimeout(1000);
      const epodDoneScreenshot = path.join(ARTIFACT_DIR, 'qc_portal_epod_certified.png');
      await page.screenshot({ path: epodDoneScreenshot });
      console.log(`✓ Saved ${epodDoneScreenshot}`);

      const doneBtn = await page.getByRole('button', { name: /Done/i }).first();
      if (doneBtn) await doneBtn.click();
      await page.waitForTimeout(500);
    }
  }

  // 3. Verify Customer Portal: Projects tab & Voice Work Orders
  console.log('3. Testing /portal projects tab (Voice Work Orders)...');
  const projectsTab = await page.getByRole('button', { name: /Projects/i }).first();
  if (projectsTab) {
    await projectsTab.click();
    await page.waitForTimeout(1500);

    // Click microphone to simulate voice recording
    const micBtn = await page.locator('button:has(svg.lucide-mic)').first();
    if (await micBtn.isVisible()) {
      console.log('Clicking Mic to record voice memo...');
      await micBtn.click();
      await page.waitForTimeout(2000);

      // Click again to stop and process
      const stopBtn = await page.locator('button:has(svg.lucide-square)').first();
      if (await stopBtn.isVisible()) {
        await stopBtn.click();
        await page.waitForTimeout(2000); // wait for AI transcription simulation
      }
    }

    const voiceScreenshot = path.join(ARTIFACT_DIR, 'qc_portal_voice_work_orders.png');
    await page.screenshot({ path: voiceScreenshot });
    console.log(`✓ Saved ${voiceScreenshot}`);
  }

  // 4. Verify WhatsApp Concierge Modal
  console.log('4. Testing WhatsApp Concierge Modal...');
  const whatsappFloatingBtn = await page.locator('button[title*="WhatsApp"]').first();
  if (await whatsappFloatingBtn.isVisible()) {
    await whatsappFloatingBtn.click();
    await page.waitForTimeout(1000);
    const waScreenshot = path.join(ARTIFACT_DIR, 'qc_whatsapp_concierge_modal.png');
    await page.screenshot({ path: waScreenshot });
    console.log(`✓ Saved ${waScreenshot}`);
  }

  await browser.close();
  console.log('--- All New Energy Suite Tests Complete ---');
}

run().catch((err) => {
  console.error('Error during test execution:', err);
  process.exit(1);
});
