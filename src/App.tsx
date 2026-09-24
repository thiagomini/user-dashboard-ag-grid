import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import {
  createFakeUsersApi,
  fakeUsersApi,
  type FakeUsersApiScenario,
} from './api/fakeUsersApi';
import type { UsersApi } from './api/users';
import { Dashboard } from './components/Dashboard';

ModuleRegistry.registerModules([AllCommunityModule]);

type AppProps = {
  usersApi?: UsersApi;
  fakeUsersApiScenario?: FakeUsersApiScenario;
};

export function App({
  usersApi = fakeUsersApi,
  fakeUsersApiScenario,
}: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: false,
          },
        },
      }),
  );
  const api = fakeUsersApiScenario
    ? createFakeUsersApi(fakeUsersApiScenario)
    : usersApi;

  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard usersApi={api} />
    </QueryClientProvider>
  );
}
