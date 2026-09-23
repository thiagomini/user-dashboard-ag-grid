import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('renders every user in the corresponding columns when loaded', async ({
  page,
}) => {
  const grid = page.getByTestId('user-grid');

  await expect(
    grid.getByRole('columnheader', { name: 'Name', exact: true }),
  ).toBeVisible();
  await expect(
    grid.getByRole('columnheader', { name: 'Surname', exact: true }),
  ).toBeVisible();
  await expect(
    grid.getByRole('columnheader', { name: 'Email', exact: true }),
  ).toBeVisible();
  await expect(
    grid.getByRole('columnheader', { name: 'Created at', exact: true }),
  ).toBeVisible();
  await expect(
    grid.getByRole('columnheader', { name: 'Role', exact: true }),
  ).toBeVisible();

  const adaRow = grid.getByRole('row', { name: /Ada Lovelace/ });
  await expect(adaRow).toContainText('ada.lovelace@example.com');
  await expect(adaRow).toContainText('15/01/2024');
  await expect(adaRow).toContainText('Admin');
  await expect(grid.getByRole('row')).toHaveCount(5);
});

test('filters users through the quick filter', async ({ page }) => {
  const grid = page.getByTestId('user-grid');

  await page.getByRole('textbox', { name: 'Search users' }).fill('Hopper');

  await expect(grid.getByRole('row', { name: /Grace Hopper/ })).toBeVisible();
  await expect(grid.getByRole('row', { name: /Ada Lovelace/ })).toHaveCount(0);
  await expect(grid.getByRole('row')).toHaveCount(2);
});

test('sorts the Name column but does not sort the Role column', async ({
  page,
}) => {
  const grid = page.getByTestId('user-grid');
  const nameHeader = grid.getByRole('columnheader', {
    name: 'Name',
    exact: true,
  });
  const roleHeader = grid.getByRole('columnheader', {
    name: 'Role',
    exact: true,
  });

  await nameHeader.click();

  await expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
  await expect(grid.getByRole('row').nth(1)).toContainText('Ada');
  await expect(roleHeader).not.toHaveAttribute('aria-sort');

  await roleHeader.click();

  await expect(roleHeader).not.toHaveAttribute('aria-sort');
  await expect(grid.getByRole('row').nth(1)).toContainText('Ada');
});

test('shows a loading state while users are being fetched', async ({
  page,
}) => {
  await page.route('**/users.json', () => new Promise(() => {}));
  await page.reload();

  await expect(page.getByRole('status')).toHaveText('Loading users...');
});
