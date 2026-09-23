import { fetchUsers, type UsersApi } from './users';

export const fakeUsersApi: UsersApi = {
  getUsers: () => fetchUsers('/users.json'),
};
