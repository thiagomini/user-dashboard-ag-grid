import { Locator } from '@playwright/test';

export function createUIDriver(grid: Locator) {
  return {
    getRow: (rowName: RegExp) => grid.getByRole('row', { name: rowName }),
    getAllRows: () => grid.locator('role= row'),
    getRowByIndex: (index: number) => grid.locator('role= row').nth(index),
    getColumnHeader: (columnName: string) =>
      grid.getByRole('columnheader', { name: columnName, exact: true }),
  };
}
