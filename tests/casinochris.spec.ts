import { test, expect } from '@playwright/test';

const URL = 'https://casinochris.vercel.app';

async function register(page: any) {
  await page.goto(URL);
  await page.waitForLoadState('networkidle');
  await page.locator('#nav-register-btn').click();
  await page.waitForTimeout(500);
  await page.locator('#reg-name').fill('Chris Christoforou');
  await page.locator('#reg-email').fill('chris@test.com');
  await page.locator('#reg-dob').fill('1990-01-01');
  await page.locator('#reg-password').fill('Password123');
  await page.locator('#page-register .btn-primary').click();
  await page.waitForTimeout(1000);
}

test('registration: valid details succeeds', async ({ page }) => {
  await register(page);
  await expect(page.locator('#dash-name')).toHaveText('Chris');
});

test('registration: under-18 is blocked', async ({ page }) => {
  await page.goto(URL);
  await page.waitForLoadState('networkidle');
  await page.locator('#nav-register-btn').click();
  await page.waitForTimeout(500);
  await page.locator('#reg-name').fill('Young Player');
  await page.locator('#reg-email').fill('young@test.com');
  await page.locator('#reg-dob').fill('2010-01-01');
  await page.locator('#reg-password').fill('Password123');
  await page.locator('#page-register .btn-primary').click();
  await expect(page.locator('#reg-error')).toContainText('18 or older');
});

test('registration: missing name shows error', async ({ page }) => {
  await page.goto(URL);
  await page.waitForLoadState('networkidle');
  await page.locator('#nav-register-btn').click();
  await page.waitForTimeout(500);
  await page.locator('#reg-email').fill('test@test.com');
  await page.locator('#reg-dob').fill('1990-01-01');
  await page.locator('#reg-password').fill('Password123');
  await page.locator('#page-register .btn-primary').click();
  await expect(page.locator('#reg-error')).toContainText('full name');
});

test('login: correct credentials succeeds', async ({ page }) => {
  await register(page);
  await page.locator('#nav-logout-btn').click();
  await page.waitForTimeout(500);
  await page.locator('#nav-login-btn').click();
  await page.waitForTimeout(500);
  await page.locator('#login-email').fill('chris@test.com');
  await page.locator('#login-password').fill('Password123');
  await page.locator('#page-login .btn-primary').click();
  await page.waitForTimeout(500);
  await expect(page.locator('#dash-name')).toHaveText('Chris');
});

test('login: wrong password shows error', async ({ page }) => {
  await register(page);
  await page.locator('#nav-logout-btn').click();
  await page.waitForTimeout(500);
  await page.locator('#nav-login-btn').click();
  await page.waitForTimeout(500);
  await page.locator('#login-email').fill('chris@test.com');
  await page.locator('#login-password').fill('WrongPassword');
  await page.locator('#page-login .btn-primary').click();
  await page.waitForTimeout(500);
  await expect(page.locator('#login-error')).toContainText('Incorrect');
});

test('deposit: adds funds to balance', async ({ page }) => {
  await register(page);
  await page.locator('.deposit-btn').first().click();
  await page.waitForTimeout(500);
  await expect(page.locator('#dash-balance')).toHaveText('€1050.00');
});

test('coin flip: balance changes after flip', async ({ page }) => {
  await register(page);
  await page.locator('.game-card').click();
  await page.waitForTimeout(500);
  await page.locator('#bet-amount').fill('10');
  await page.locator('.flip-btn').click();
  await page.waitForTimeout(2000);
  const balance = await page.locator('#game-balance').textContent();
  expect(balance).not.toBe('€1000.00');
});

test('RG: self-exclusion blocks game entry', async ({ page }) => {
  await register(page);
  await page.locator('#nav-rg-btn').click();
  await page.waitForTimeout(500);
  await page.locator('#exclusion-set-btn').click();
  await page.waitForTimeout(500);
  await page.locator('#page-rg .back-link').click();
  await page.waitForTimeout(500);
  await page.locator('.game-card').click();
  await expect(page.locator('#page-blocked')).toBeVisible();
});

test('RG: flip limit locks game after limit reached', async ({ page }) => {
  await register(page);
  await page.locator('#nav-rg-btn').click();
  await page.waitForTimeout(500);
  await page.locator('#rg-spin-input').fill('1');
  await page.locator('#rg-spin-input').press('Tab');
await page.locator('#page-rg .btn-primary').nth(1).click();
  await page.waitForTimeout(500);
  await page.locator('#page-rg .back-link').click();
  await page.waitForTimeout(500);
  await page.locator('.game-card').click();
  await page.waitForTimeout(500);
  await page.locator('#bet-amount').fill('10');
  await page.locator('.flip-btn').click();
  await page.waitForTimeout(2000);
  await expect(page.locator('.flip-btn')).toBeDisabled();
});