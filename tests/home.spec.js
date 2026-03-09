import { test, expect } from "@playwright/test";

test("Home carga y título correcto", async ({ page }) => {
  await page.goto("/index.html");
  await expect(page).toHaveTitle(/Amanda Cereja/i);
});

test("Hero y CTA visibles", async ({ page }) => {
  await page.goto("/index.html#hero");
  await expect(page.locator(".hero__title")).toBeVisible();
  await expect(page.locator(".hero__subtitle")).toBeVisible();
});

test("Navegación a Checklist funciona", async ({ page }) => {
  await page.goto("/index.html");

  const checklistLink = page.locator(".navbar__menu").getByRole("link", { name: /^Checklist$/i });
  await checklistLink.click();

  await expect(page).toHaveURL(/\/checklist\.html$/i);
  await expect(page).toHaveTitle(/Checklist/i);
});
