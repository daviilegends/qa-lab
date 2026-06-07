import { test, expect } from '../../fixtures/index.js';
import { ensureEvidenceDir, saveScreenshot, saveJson } from '../../utils/evidence.js';

test.describe('@checkout Order placement flow', () => {
  test('places an order and saves evidence', async ({ cartWithItem }, testInfo) => {
    ensureEvidenceDir();
    const page = cartWithItem;

    try {
      // navigate to checkout (cartWithItem fixture already placed an item and is on /cart)
      await page.getByTestId('checkout-link').click();

      // fill checkout form
      await expect(page.getByLabel('Full name')).toBeVisible();
      await page.getByTestId('address-fullname-input').fill('QA Tester');
      await page.getByTestId('address-street-input').fill('123 Test St');
      await page.getByTestId('address-city-input').fill('Testville');
      await page.getByTestId('address-postal-input').fill('12345');
      await page.getByTestId('address-country-input').fill('Testland');

      // payment details: use success dummy card
      await page.getByTestId('card-number-input').fill('4111111111111111');
      await page.getByTestId('card-expiry-input').fill('12/29');
      await page.getByTestId('card-cvc-input').fill('123');

      // place order
      await expect(page.getByTestId('place-order-button')).toBeVisible();
      await page.getByTestId('place-order-button').click();

      // verify order confirmation
      await expect(page.getByTestId('confirmation-heading')).toBeVisible();
      const orderNumber = await page.getByTestId('order-number').textContent();
      const orderTotalText = await page.getByTestId('order-total').textContent();

      // save JSON evidence
      const orderData = { orderNumber: orderNumber?.trim(), total: orderTotalText?.trim(), test: testInfo.title };
      const jsonPath = saveJson(orderData, `order-${orderNumber?.trim() ?? 'unknown'}`);

      // save screenshot evidence (POT naming)
      const screenshotPath = await saveScreenshot(page, testInfo.title, 'passed');

      testInfo.attachments = testInfo.attachments || [];
      testInfo.attachments.push({ name: 'evidence-json', path: jsonPath });
      testInfo.attachments.push({ name: 'evidence-screenshot', path: screenshotPath });

      // basic assertions
      expect(orderNumber).toBeTruthy();
      expect(orderTotalText).toMatch(/\$\d+/);
    } catch (err) {
      // on failure capture screenshot with POT naming and rethrow
      await saveScreenshot(page, testInfo.title, 'failed');
      throw err;
    }
  });
});
