import { test, expect, Page } from '@playwright/test';

// Registration checks for CasinoChris.
// Each test title starts with its Jira key (CCASINO-8 to CCASINO-15) so a test run
// can be matched back to its ticket. Run them all with:
//   npx playwright test --grep @registration

const BASE_URL = process.env.BASE_URL || 'https://casinochris.vercel.app';

const valid = {
  name: 'Chris Christoforou',
  email: 'chris@test.com',
  dob: '1990-01-01',
  password: 'Password123',
};

// Date of birth calculated from today, so the age checks stay valid over time.
function dobYearsAgo(years: number): string {
  const today = new Date();
  const month = today.getMonth() + 1;
  // 29 Feb does not exist in most years, so use 28 Feb instead.
  const day = month === 2 && today.getDate() === 29 ? 28 : today.getDate();
  const year = today.getFullYear() - years;
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

async function submitRegistration(page: Page, overrides: Partial<typeof valid> = {}) {
  const data = { ...valid, ...overrides };
  await page.goto(BASE_URL);
  await page.locator('#nav-register-btn').click();
  await expect(page.locator('#page-register')).toBeVisible();

  // An empty value means "leave this field blank".
  if (data.name) await page.locator('#reg-name').fill(data.name);
  if (data.email) await page.locator('#reg-email').fill(data.email);
  if (data.dob) await page.locator('#reg-dob').fill(data.dob);
  if (data.password) await page.locator('#reg-password').fill(data.password);

  await page.locator('#page-register .btn-primary').click();
}

async function expectRejected(page: Page, message: string) {
  await expect(page.locator('#reg-error')).toHaveText(message);
  await expect(page.locator('#page-dashboard')).not.toBeVisible();
}

test.describe('Registration @registration', () => {
  test('CCASINO-8 valid details succeed', async ({ page }) => {
    await submitRegistration(page);
    await expect(page.locator('#dash-name')).toHaveText('Chris');
    await expect(page.locator('#dash-balance')).toHaveText('€1000.00');
  });

  test('CCASINO-9 under-18 player is rejected', async ({ page }) => {
    await submitRegistration(page, { dob: dobYearsAgo(17) });
    await expectRejected(page, 'You must be 18 or older to register. Access denied.');
  });

  test('CCASINO-10 player turning exactly 18 today is accepted', async ({ page }) => {
    await submitRegistration(page, { dob: dobYearsAgo(18) });
    await expect(page.locator('#dash-name')).toHaveText('Chris');
  });

  test('CCASINO-11 missing name is rejected', async ({ page }) => {
    await submitRegistration(page, { name: '' });
    await expectRejected(page, 'Please enter your full name.');
  });

  test('CCASINO-12 missing email is rejected', async ({ page }) => {
    await submitRegistration(page, { email: '' });
    await expectRejected(page, 'Please enter a valid email address.');
  });

  test('CCASINO-13 invalid email format is rejected', async ({ page }) => {
    await submitRegistration(page, { email: 'notanemail' });
    await expectRejected(page, 'Please enter a valid email address.');
  });

  test('CCASINO-14 missing date of birth is rejected', async ({ page }) => {
    await submitRegistration(page, { dob: '' });
    await expectRejected(page, 'Please enter your date of birth.');
  });

  test('CCASINO-15 password under 8 characters is rejected', async ({ page }) => {
    await submitRegistration(page, { password: 'Pass123' });
    await expectRejected(page, 'Password must be at least 8 characters.');
  });
});
