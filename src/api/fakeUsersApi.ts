import { fetchUsers, type User, type UsersApi } from './users';

export type FakeUsersApiScenario =
  | {
      status: 'success';
      users: User[];
    }
  | {
      status: 'loading';
    };

export const fakeUsersApi: UsersApi = {
  getUsers: () => fetchUsers('/users.json'),
};

export function createFakeUsersApi(
  scenario: FakeUsersApiScenario,
): UsersApi {
  switch (scenario.status) {
    case 'success':
      return {
        getUsers: async () => scenario.users,
      };
    case 'loading':
      return {
        getUsers: () => new Promise(() => {}),
      };
  }
}
