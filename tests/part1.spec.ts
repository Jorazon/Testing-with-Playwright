import { test, expect } from "@playwright/test";

// Add consent cookie.
test.beforeEach(async ({ page, context }) => {
	context.addCookies([
		{
			name: "yleconsent",
			value: "v1|",
			domain: ".yle.fi",
			path: "/",
		},
	]);
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

		let login_form_locator = await page.locator(".tunnus-sdk__iframe");
		let login_form_frame_locator = await login_form_locator.frameLocator(":scope");

		// Click register button
		await login_form_frame_locator.locator("button.register-button").click();

		await page.waitForLoadState("networkidle");

		// Fill the form
		await login_form_frame_locator
			.getByRole("textbox", { name: "Sähköposti", exact: true })
			.fill("test@test,test"); // Intentional mistaken comma in email
		await login_form_frame_locator
			.getByRole("textbox", { name: "Salasana", exact: true })
			.fill("test1234");
		await login_form_frame_locator
			.getByRole("combobox", { name: "Kuukausi" })
			.selectOption({ index: Math.floor(Math.random() * 12) });
		await login_form_frame_locator
			.getByRole("combobox", { name: "Vuosi" })
			.selectOption({ index: Math.floor(Math.random() * 110) });

		// Submit
		await login_form_frame_locator.getByRole("button", { name: "Luo Tunnus" }).click();

		// Expect email in wrong format message to exist
		expect(
			await login_form_frame_locator.getByText("Tarkista sähköpostiosoitteen muoto.").count(),
		).toBeGreaterThan(0);
	});
});

test.describe("TV Guide", () => {
	test("10 PM News Exists", async ({ page }) => {
		await page.goto("https://areena.yle.fi/tv/opas");

		// Show past programs
		await page.getByRole("checkbox", { name: "Näytä menneet ohjelmat" }).click();

		// find all scheduled program cards
		let cards = await page
			.locator(".schedule-card")
			// Filter programs that begin at 10 pm
			.filter({
				has: page.locator('time[itemprop="startDate"]', {
					hasText: "22.00",
				}),
			})
			// Filter programs titled "Kymmenen uutiset"
			.filter({
				has: page.locator('span[itemprop="name"]', {
					hasText: "Kymmenen uutiset",
				}),
			});

		// One and only one should exist
		expect(await cards.count()).toEqual(1);
	});

	test("Channel logos with correct images", async ({ page, browserName }) => {
		await page.goto("https://areena.yle.fi/tv/opas");

		// Expected values
		const images = [
			"yle-tv1_vtc.png",
			"yle-tv2_vtc.png",
			"yle-teema-fem_vt.png",
			"yle-areena_vt.png",
			"MTV3_vtc.png",
			"Nelonen_vtc.png",
			"Sub_vtc.png",
			"TV5_vt.png",
			"Liv_vtc.png",
			"JIM_vtc.png",
			"Kutonen_vtc.png",
			"TLC_vtc.png",
			"STAR%20Channel_vtc.png",
			"Ava_vtc.png",
			"Hero_vtc.png",
			"Frii_vtc.png",
			"National%20Geographic_vt.png",
			"tv-finland_vt.png",
		];

		// Find all channel logos
		const headers = await page.locator(".channel-header__logo").all();

		// Number of found channel headers is as expected
		expect(headers.length).toBe(images.length);

		// Map to attribute object
		const attributes = await Promise.all(
			headers.map(async (element, index) => {
				let style = await element.getAttribute("style");
				return style;
			}),
		);

		// Compare images
		const images_match = attributes.every((style, index) => {
			return style?.includes(images[index]);
		});

		expect(images_match).toBeTruthy();
	});

	test("Channel logos with correct labels", async ({ page, browserName }) => {
		await page.goto("https://areena.yle.fi/tv/opas");

		// Expected values
		const labels = [
			"Yle TV1",
			"Yle TV2",
			"Yle Teema Fem",
			"Yle Areena",
			"MTV3",
			"Nelonen",
			"Sub",
			"TV5",
			"Liv",
			"JIM",
			"Kutonen",
			"TLC",
			"STAR Channel",
			"Ava",
			"Hero",
			"Frii",
			"National Geographic",
			"TV Finland",
		];

		// Find all channel logos
		const headers = await page.locator(".channel-header__logo").all();

		// Number of found channel headers is as expected
		expect(headers.length).toBe(labels.length);

		// Map to attribute object
		const attributes = await Promise.all(
			headers.map(async (element, index) => {
				return await element.getAttribute("aria-label");
			}),
		);

		// Compare labels
		const labels_match = attributes.every((label, index) => {
			return label?.includes(labels[index]);
		});

		expect(labels_match).toBeTruthy();
	});
});

test.describe("Kummeli", () => {
	test("Find date of airing of S03E05", async ({ page, browserName }) => {
		await page.goto("https://areena.yle.fi/1-3339547");
		await page.getByRole("button", { name: "Kausi 3" }).click();
		await page.waitForLoadState("networkidle");

		const episodes = await page.locator(".CardPage_listItem__JRVg1");
		//console.log("Episode count: ", await episodes.count());

		const ep5 = await episodes.nth(4);
		//await ep5.screenshot({ path: `img/${browserName}/kummeli airing.png` });

		expect(await ep5.getByText("ti 8.3.2016").count()).toBe(1);
	});

	test("Find name of S03E05", async ({ page, browserName }) => {
		await page.goto("https://areena.yle.fi/1-3339547");
		await page.getByRole("button", { name: "Kausi 3" }).click();
		await page.waitForLoadState("networkidle");

		const episodes = await page.locator(".CardPage_listItem__JRVg1");
		//console.log("Episode count: ", await episodes.count());

		const ep5 = await episodes.nth(4);
		//await ep5.screenshot({ path: `img/${browserName}/kummeli name.png` });

		expect(await ep5.getByText("5. Kummeli ").count()).toBe(1);
	});
});
