import { expect, test } from '@playwright/experimental-ct-react';
import { createUIDriver } from './ag-grid-ui-driver';
import type { User } from '../src/api/users';
import { App } from '../src/App';

const users: User[] = [
  {
    id: '1',
    name: 'Ada',
    surname: 'Lovelace',
    email: 'ada.lovelace@example.com',
    created_at: '2024-01-15',
    role: 'Admin',
  },
  {
    id: '2',
    name: 'Grace',
    surname: 'Hopper',
    email: 'grace.hopper@example.com',
    created_at: '2024-02-10',
    role: 'Editor',
  },
];

test('renders the supplied users in the corresponding columns', async ({
  mount,
}) => {
  const component = await mount(
    <App fakeUsersApiScenario={{ status: 'success', users }} />,
  );
  const grid = component.getByTestId('user-grid');

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
  await expect(grid.getByRole('row')).toHaveCount(3);
});

test('renders the supplied users in the corresponding columns (improved)', async ({
  mount,
}) => {
  const component = await mount(
    <App fakeUsersApiScenario={{ status: 'success', users }} />,
  );
  const grid = createUIDriver(component.getByTestId('user-grid'));

  await expect(grid.getColumnHeader('Name')).toBeVisible();
  await expect(grid.getColumnHeader('Surname')).toBeVisible();
  await expect(grid.getColumnHeader('Email')).toBeVisible();
  await expect(grid.getColumnHeader('Created at')).toBeVisible();
  await expect(grid.getColumnHeader('Role')).toBeVisible();

  const adaRow = grid.getRow(/Ada Lovelace/);
  await expect(adaRow).toContainText('ada.lovelace@example.com');
  await expect(adaRow).toContainText('15/01/2024');
  await expect(adaRow).toContainText('Admin');

  // Header row plus data rows
  await expect(grid.getAllRows()).toHaveCount(3);
});

test('filters the supplied users through the quick filter', async ({
  mount,
}) => {
  const component = await mount(
    <App fakeUsersApiScenario={{ status: 'success', users }} />,
  );
  const grid = component.getByTestId('user-grid');

  await component.getByRole('textbox', { name: 'Search users' }).fill('Hopper');

  await expect(grid.getByRole('row', { name: /Grace Hopper/ })).toBeVisible();
  await expect(grid.getByRole('row', { name: /Ada Lovelace/ })).toHaveCount(0);
  await expect(grid.getByRole('row')).toHaveCount(2);
});

test('sorts the supplied users by name but not by role', async ({ mount }) => {
  const component = await mount(
    <App
      fakeUsersApiScenario={{ status: 'success', users: [...users].reverse() }}
    />,
  );
  const grid = component.getByTestId('user-grid');
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
  await expect(grid.getByRole('row', { name: /Ada Lovelace/ })).toHaveAttribute(
    'row-index',
    '0',
  );
  await expect(roleHeader).not.toHaveAttribute('aria-sort');

  await roleHeader.click();

  await expect(roleHeader).not.toHaveAttribute('aria-sort');
  await expect(grid.getByRole('row', { name: /Ada Lovelace/ })).toHaveAttribute(
    'row-index',
    '0',
  );
});

test('shows a loading state while the supplied API is pending', async ({
  mount,
}) => {
  const component = await mount(
    <App fakeUsersApiScenario={{ status: 'loading' }} />,
  );

  await expect(component.getByRole('status')).toHaveText('Loading users...');
});
