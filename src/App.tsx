import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { fakeUsersApi } from './api/fakeUsersApi';
import type { UsersApi } from './api/users';
import { Dashboard } from './components/Dashboard';

ModuleRegistry.registerModules([AllCommunityModule]);

type AppProps = {
  usersApi?: UsersApi;
};

export function App({ usersApi = fakeUsersApi }: AppProps) {
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

  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard usersApi={usersApi} />
    </QueryClientProvider>
  );
}
