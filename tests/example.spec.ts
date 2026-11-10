import { test, expect } from '@playwright/test';

test('login journey on practice site', async ({ page }) => {
  // 1. Go to a practice test site
  await page.goto('https://the-internet.herokuapp.com/login');
  await page.waitForTimeout(2000);

  // 2. Type a username
  await page.locator('#username').fill('tomsmith');
  await page.waitForTimeout(1500);

  // 3. Type a password
  await page.locator('#password').fill('SuperSecretPassword!');
  await page.waitForTimeout(1500);

  // 4. Click the Login button
  await page.getByRole('button', { name: /login/i }).click();
  await page.waitForTimeout(2000);

  // 5. Check we logged in successfully (a success message appears)
  await expect(page.locator('#flash')).toContainText('You logged into a secure area');
  console.log('✓ Login successful');
  await page.waitForTimeout(2000);

  // 6. Scroll down a bit
  await page.mouse.wheel(0, 300);
  await page.waitForTimeout(2000);

  // 7. Click Logout
  await page.getByRole('link', { name: /logout/i }).click();
  await page.waitForTimeout(2500);
});