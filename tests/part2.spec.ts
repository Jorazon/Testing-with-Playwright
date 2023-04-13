import { test, expect } from "@playwright/test";
import { injectAxe, checkA11y, getViolations, reportViolations } from 'axe-playwright'

test.describe("areena.yle.fi/tv accessibility", () => {
	test("should not have any automatically detectable accessibility issues", async ({ page }, testInfo) => {
		await page.goto("https://areena.yle.fi/tv");
		await injectAxe(page);
		await checkA11y(page, {}, {}, true);
		const violations = await getViolations(page);
		await testInfo.attach(
			"detailed violation summary",
			{
				contentType: "application/json",
				body: JSON.stringify(violations, null, 2)
			}
		);
	});
});

test.describe("areena.yle.fi/tv/opas accessibility", () => {
	test("should not have any automatically detectable accessibility issues", async ({ page }, testInfo) => {
		test.slow();
		await page.goto("https://areena.yle.fi/tv/opas");
		await injectAxe(page);
		await checkA11y(page, {}, {}, true);
		const violations = await getViolations(page);
		await testInfo.attach(
			"detailed violation summary",
			{
				contentType: "application/json",
				body: JSON.stringify(violations, null, 2)
			}
		);
	});
});

test.describe("areena.yle.fi/1-3339547 accessibility", () => {
	test("should not have any automatically detectable accessibility issues", async ({ page }, testInfo) => {
		await page.goto("https://areena.yle.fi/1-3339547");
		await injectAxe(page);
		await checkA11y(page, {}, {}, true);
		const violations = await getViolations(page);
		await testInfo.attach(
			"detailed violation summary",
			{
				contentType: "application/json",
				body: JSON.stringify(violations, null, 2)
			}
		);
	});
});
