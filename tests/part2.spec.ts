import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test.describe.skip("areena.yle.fi/tv accessibility", () => {
	test("should not have any automatically detectable accessibility issues", async ({ page }) => {
		await page.goto("https://areena.yle.fi/tv");

		// run the accessibility scan
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

		// verify that there are no violations in the scan results
		expect.soft(accessibilityScanResults.violations).toEqual([]);
	});
});

test.describe.skip("areena.yle.fi/tv/opas accessibility", () => {
	test("should not have any automatically detectable accessibility issues", async ({ page }) => {
		test.slow();

		await page.goto("https://areena.yle.fi/tv/opas");

		// run the accessibility scan
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

		// verify that there are no violations in the scan results
		expect.soft(accessibilityScanResults.violations).toEqual([]);
	});
});

test.describe.skip("areena.yle.fi/1-3339547 accessibility", () => {
	test("should not have any automatically detectable accessibility issues", async ({ page }) => {
		await page.goto("https://areena.yle.fi/1-3339547");

		// run the accessibility scan
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

		// verify that there are no violations in the scan results
		expect.soft(accessibilityScanResults.violations).toEqual([]);
	});
});
