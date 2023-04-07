import { test, expect } from "@playwright/test";

test.describe("Main page", () => {
	test("has title", async ({ page }) => {
		await page.goto("https://areena.yle.fi/tv");

		// Expect a title "to contain" a substring.
		await expect(page).toHaveTitle(/Yle Areena/);
	});

	test("log in link", async ({ page, browserName }) => {
		await page.goto("https://areena.yle.fi/tv");

		// Consent to necessary cookies only.
		if (browserName === "firefox") {
			await page.locator('button[name="accept-necessary-consents"]').click();
		}

		// Click the log in button.
		await page.locator(".yle-header-tunnus-login").click();
	});
});

test.describe("TV Guide", () => {
	test("10 PM News Exists", async ({ page, browserName }) => {
		await page.goto("https://areena.yle.fi/tv/opas");

		// Consent to necessary cookies only.
		if (browserName === "firefox") {
			await page.locator('button[name="accept-necessary-consents"]').click();
		}

		// Show past programs
		await page.locator("#past-programs-toggle-checkbox").click();

		// find all schedule cards
		let cards = await page.locator(".schedule-card").filter({
			has: page.locator('time[itemprop="startDate"]', {
				hasText: "22.00",
			})
		}).filter({
			has: page.locator('span[itemprop="name"]', {
				hasText: "Kymmenen uutiset",
			})
		});

		// should be just the one
		expect(await cards.count()).toEqual(1);
	});
});