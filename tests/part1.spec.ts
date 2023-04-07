import { test, expect } from "@playwright/test";

// Add consent cookie.
test.beforeEach(async ({ page }) => {
	await page.goto("https://areena.yle.fi/tv");

	// Consent to necessary cookies if prompted
	let consent_button = await page.locator('button[name="accept-necessary-consents"]');
	if (await consent_button.count() > 0) {
		consent_button.click();
	}
});

/*
// check cookies
test.afterEach(async ({ context }) => {
	console.log(await context.cookies("https://areena.yle.fi"));
});
*/

test.describe("Main page", () => {
	test("Create YLE account", async ({ page }) => {
		await page.goto("https://areena.yle.fi/tv");

		// Click the log in button.
		await page.locator(".yle-header-tunnus-login").click();
	});
});

test.describe("TV Guide", () => {
	test("10 PM News Exists", async ({ page }) => {
		await page.goto("https://areena.yle.fi/tv/opas");

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