import { useMemo, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import type { ColDef } from 'ag-grid-community';
import { useQuery } from '@tanstack/react-query';
import { usersApi, type User, type UsersApi } from '../api/users';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

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

type DashboardProps = {
  usersApi?: UsersApi;
};

export function Dashboard({ usersApi: api = usersApi }: DashboardProps) {
  const [quickFilter, setQuickFilter] = useState('');
  const columnDefs = useMemo(() => columnDefinitions, []);
  const { data: users, error, isPending, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: api.getUsers,
  });

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
            <p>{users?.length ?? 0} active users</p>
          </div>
          {!isPending && !error && (
            <label className="quick-filter">
              Search users
              <input
                aria-label="Search users"
                placeholder="Search by name, email, or role"
                value={quickFilter}
                onChange={(event) => setQuickFilter(event.target.value)}
              />
            </label>
          )}
        </div>

        {isPending ? (
          <p role="status">Loading users...</p>
        ) : error ? (
          <div role="alert">
            <p>{error.message}</p>
            <button type="button" onClick={() => refetch()}>
              Try again
            </button>
          </div>
        ) : (
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
        )}
      </section>
    </main>
  );
}
