import { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import {
  AllCommunityModule,
  ModuleRegistry,
  type ColDef,
} from 'ag-grid-community';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

ModuleRegistry.registerModules([AllCommunityModule]);

type User = {
  id: string;
  name: string;
  surname: string;
  email: string;
  created_at: string;
  role: 'Admin' | 'Editor' | 'Viewer';
};

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
  {
    id: '3',
    name: 'Alan',
    surname: 'Turing',
    email: 'alan.turing@example.com',
    created_at: '2024-03-05',
    role: 'Viewer',
  },
  {
    id: '4',
    name: 'Katherine',
    surname: 'Johnson',
    email: 'katherine.johnson@example.com',
    created_at: '2024-04-22',
    role: 'Editor',
  },
];

const columnDefinitions: ColDef<User>[] = [
  { field: 'name', headerName: 'Name', sortable: true },
  { field: 'surname', headerName: 'Surname', sortable: true },
  { field: 'email', headerName: 'Email', sortable: true, flex: 1.5 },
  {
    field: 'created_at',
    headerName: 'Created at',
    sortable: true,
    valueFormatter: ({ value }) =>
      new Intl.DateTimeFormat('en-GB').format(new Date(`${value}T00:00:00`)),
  },
  { field: 'role', headerName: 'Role', sortable: false },
];

export function App() {
  const [quickFilter, setQuickFilter] = useState('');
  const columnDefs = useMemo(() => columnDefinitions, []);

  return (
    <main className="dashboard">
      <header>
        <p className="eyebrow">Acme Admin</p>
        <h1>User Dashboard</h1>
        <p className="subtitle">Manage the users of your application.</p>
      </header>

      <section aria-labelledby="users-heading" className="user-list">
        <div className="section-heading">
          <div>
            <h2 id="users-heading">Users</h2>
            <p>{users.length} active users</p>
          </div>
          <label className="quick-filter">
            Search users
            <input
              aria-label="Search users"
              placeholder="Search by name, email, or role"
              value={quickFilter}
              onChange={(event) => setQuickFilter(event.target.value)}
            />
          </label>
        </div>

        <div
          className="ag-theme-quartz grid"
          aria-label="User list"
          data-testid="user-grid"
        >
          <AgGridReact<User>
            columnDefs={columnDefs}
            rowData={users}
            getRowId={({ data }) => data.id}
            quickFilterText={quickFilter}
            domLayout="autoHeight"
            defaultColDef={{ resizable: true }}
          />
        </div>
      </section>
    </main>
  );
}
