import { test, expect } from '@playwright/test';

test.describe('HR Sports Platform Smoke Tests', () => {
  test('homepage renders hero, capabilities, and worldwide shipping grid', async ({ page }) => {
    await page.goto('/');

    // Check brand header
    await expect(page.getByText('HR SPORTS').first()).toBeVisible();

    // Check Hero title
    await expect(page.getByRole('heading', { name: /Industrial-Scale Apparel Manufacturing/i })).toBeVisible();

    // Check We Ship Everywhere inverted section
    await expect(page.getByRole('heading', { name: /We Ship Everywhere/i })).toBeVisible();
  });

  test('navigates to USA market page and renders comparison table', async ({ page }) => {
    await page.goto('/manufacturers/usa');

    await expect(page.getByRole('heading', { name: /Direct OEM Sportswear & Custom Apparel Manufacturing for the US Market/i })).toBeVisible();
    await expect(page.getByText(/Direct Unit Cost/i)).toBeVisible();
    await expect(page.getByText(/30 pieces minimum per design/i).first()).toBeVisible();
  });

  test('navigates to contact page and fills out quote inquiry step 1', async ({ page }) => {
    await page.goto('/contact');

    await expect(page.getByRole('heading', { name: /Request a Factory-Direct Quote/i })).toBeVisible();
    await expect(page.getByText(/Step 01 of 03/i)).toBeVisible();

    await page.getByLabel(/Company or Brand Name/i).fill('Apex Collegiate Sports');
    await page.getByLabel(/Corporate Email Address/i).fill('procurement@apexcollegiate.com');

    await page.getByRole('button', { name: /Continue to Garment Specs/i }).click();

    // Verify progression to step 2
    await expect(page.getByText(/Step 02 of 03/i)).toBeVisible();
    await expect(page.getByText(/Total Order Quantity/i)).toBeVisible();
  });
});
