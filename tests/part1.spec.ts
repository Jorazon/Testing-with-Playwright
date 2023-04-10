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
		await login_form_frame_locator.getByRole("textbox", { name: "Sähköposti", exact: true }).fill("test@test,test"); // Intentional mistaken comma in email
		await login_form_frame_locator.getByRole("textbox", { name: "Salasana", exact: true }).fill("test1234");
		await login_form_frame_locator.getByRole("combobox", { name: "Kuukausi" }).selectOption({ index: Math.floor(Math.random() * 12) });
		await login_form_frame_locator.getByRole("combobox", { name: "Vuosi" }).selectOption({ index: Math.floor(Math.random() * 110) });

		// Submit
		await login_form_frame_locator.getByRole("button", { name: "Luo Tunnus" }).click();

		// Expect email in wrong format message to exist
		expect(await login_form_frame_locator.getByText("Tarkista sähköpostiosoitteen muoto.").count()).toBeGreaterThan(0);
	});
});

test.describe("TV Guide", () => {
	test("10 PM News Exists", async ({ page }) => {
		await page.goto("https://areena.yle.fi/tv/opas");

		// Show past programs
		await page.getByRole("checkbox", { name: "Näytä menneet ohjelmat" }).click();

		// find all scheduled program cards
		let cards = await page.locator(".schedule-card")
			// Filter programs that begin at 10 pm
			.filter({
				has: page.locator('time[itemprop="startDate"]', {
					hasText: "22.00",
				})
			})
			// Filter programs titled "Kymmenen uutiset"
			.filter({
				has: page.locator('span[itemprop="name"]', {
					hasText: "Kymmenen uutiset",
				})
			});

		// One and only one should exist
		expect(await cards.count()).toEqual(1);
	});

	test("Channel logos with proper labels", async ({ page, browserName }) => {
		await page.goto("https://areena.yle.fi/tv/opas");

		// Expected values
		const channels = [
			{ "label": "Yle TV1", "style": "yle-tv1_vtc.png" },
			{ "label": "Yle TV2", "style": "yle-tv2_vtc.png" },
			{ "label": "Yle Teema Fem", "style": "yle-teema-fem_vt.png" },
			{ "label": "Yle Areena", "style": "yle-areena_vt.png" },
			{ "label": "MTV3", "style": "MTV3_vtc.png" },
			{ "label": "Nelonen", "style": "Nelonen_vtc.png" },
			{ "label": "Sub", "style": "Sub_vtc.png" },
			{ "label": "TV5", "style": "TV5_vt.png" },
			{ "label": "Liv", "style": "Liv_vtc.png" },
			{ "label": "JIM", "style": "JIM_vtc.png" },
			{ "label": "Kutonen", "style": "Kutonen_vtc.png" },
			{ "label": "TLC", "style": "TLC_vtc.png" },
			{ "label": "STAR Channel", "style": "STAR%20Channel_vtc.png" },
			{ "label": "Ava", "style": "Ava_vtc.png" },
			{ "label": "Hero", "style": "Hero_vtc.png" },
			{ "label": "Frii", "style": "Frii_vtc.png" },
			{ "label": "National Geographic", "style": "National%20Geographic_vt.png" },
			{ "label": "TV Finland", "style": "tv-finland_vt.png" },
		];

		const headers = await page.locator(".channel-header__logo").all();

		// Number of found channel headers is as expected
		expect(headers.length).toBe(channels.length);

		// Map to attribute object
		const matches = await Promise.all(headers.map(async (element, index) => {
			let label = await element.getAttribute("aria-label");
			let style = await element.getAttribute("style");

			//console.log(index, label, style);

			return { "label": label, "style": style };
		}));

		// Compare labels
		const labels_match = matches.every(({ label, style }, index) => {
			const label_matches = label?.includes(channels[index].label);

			//console.log(index, label_matches);

			return label_matches;
		});

		// Compare images
		const images_match = matches.every(({ label, style }, index) => {
			const image_matches = style?.includes(channels[index].style);

			//console.log(index, image_matches);

			return image_matches;
		});

		expect(labels_match).toBeTruthy();
		expect(images_match).toBeTruthy();

	});
});