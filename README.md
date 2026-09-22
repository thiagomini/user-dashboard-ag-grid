# User Dashboard — AG Grid testing example

A small Vite and React application for demonstrating how to test a third-party UI library in frontend code. It renders an imaginary application's users with [AG Grid Community](https://www.ag-grid.com/react-data-grid/getting-started/) and covers observable browser behavior with Playwright.

## Run it

```bash
npm install
npm run dev
```

## Test it

```bash
npm run test:e2e
```

The Playwright suite verifies the initially rendered table data, quick-filter behavior, sorting the **Name** column, and the intentionally non-sortable **Role** column.
