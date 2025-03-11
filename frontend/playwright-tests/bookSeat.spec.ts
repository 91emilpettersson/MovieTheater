import { test, expect } from '@playwright/test';

test('happy-flow', async ({ page }) => {
    await page.goto('http://localhost:5173/');
    
    const firstSeatButton = await page.getByTestId("seat-button").first();
    await firstSeatButton.click();

    await page.getByTestId("book-button").click();

    await expect(firstSeatButton).toBeDisabled();
    await expect(firstSeatButton).toHaveText("X");
  });