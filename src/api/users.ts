export type User = {
  id: string;
  name: string;
  surname: string;
  email: string;
  created_at: string;
  role: 'Admin' | 'Editor' | 'Viewer';
};

export type UsersApi = {
  getUsers: () => Promise<User[]>;
};

const roles = new Set<User['role']>(['Admin', 'Editor', 'Viewer']);

function isUser(value: unknown): value is User {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const user = value as Record<string, unknown>;

  return (
    typeof user.id === 'string' &&
    typeof user.name === 'string' &&
    typeof user.surname === 'string' &&
    typeof user.email === 'string' &&
    typeof user.created_at === 'string' &&
    typeof user.role === 'string' &&
    roles.has(user.role as User['role'])
  );
}

function parseUsers(value: unknown): User[] {
  if (!Array.isArray(value) || !value.every(isUser)) {
    throw new Error('The users API returned an invalid response.');
  }

  return value;
}

export async function fetchUsers(url: string): Promise<User[]> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Unable to load users. Please try again.');
  }

  return parseUsers(await response.json());
}

export const usersApi: UsersApi = {
  getUsers: () => fetchUsers('/api/users'),
};
