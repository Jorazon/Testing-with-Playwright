import { test, expect } from "@playwright/test";

// Add consent cookie.
test.beforeEach(async ({ page, context }) => {
	context.addCookies([{
		name: 'yleconsent',
		value: "v1|",
		domain: '.yle.fi',
		path: '/',
	}])
});

/*
// Check cookies
test.afterEach(async ({ context }) => {
	console.log(await context.cookies("https://areena.yle.fi"));
});
*/

test.describe("Main page", () => {
	test("Create YLE account", async ({ page, browserName }) => {
		await page.goto("https://areena.yle.fi/tv");
		await page.setViewportSize({ width: 1080, height: 1920 });
		await page.waitForLoadState("networkidle");

		// Click the login button.
		await page.locator(".yle-header-tunnus-login").click();

		// Wait until login/register iframe is loaded
		await page.waitForLoadState("networkidle");

		let login_form_locator = await page.locator('.tunnus-sdk__iframe');
		let login_form_frame_locator = await login_form_locator.frameLocator(':scope');

		// Click register button
		await login_form_frame_locator.locator("button.register-button").click();

		await page.waitForLoadState("networkidle");

		// Fill the form 
		await login_form_frame_locator.getByRole("textbox", { name: "Sähköposti", exact: true }).fill("test1234");
		await login_form_frame_locator.getByRole("textbox", { name: "Salasana", exact: true }).fill("test1234");
		await login_form_frame_locator.getByRole("combobox", { name: "Kuukausi" }).selectOption({ index: Math.floor(Math.random() * 12) });
		await login_form_frame_locator.getByRole("combobox", { name: "Vuosi" }).selectOption({ index: Math.floor(Math.random() * 110) });

		// Submit
		await login_form_frame_locator.getByRole("button", { name: "Luo Tunnus" }).click();

		// Take screenshot
		await login_form_locator.screenshot({ path: `img/${browserName}/luo-tunnus.png` });

	});
});

test.describe("TV Guide", () => {
	test("10 PM News Exists", async ({ page }) => {
		await page.goto("https://areena.yle.fi/tv/opas");

		// Show past programs
		await page.getByRole("checkbox", { name: "Näytä menneet ohjelmat" }).click();

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