export type User = { username: string; email: string; password: string };

let users: User[] = [
  { username: 'admin', email: 'admin@mail.com', password: '123456' },
];

export function getUsers() {
  return users;
}

export function addUser(user: User) {
  users = [...users, user];
}

export function findUser(username: string, password: string) {
  return users.find(
    (u) =>
      u.username.toLowerCase() === username.trim().toLowerCase() &&
      u.password === password
  );
}

export function usernameExists(username: string) {
  return users.some((u) => u.username.toLowerCase() === username.trim().toLowerCase());
}

export function emailExists(email: string) {
  return users.some((u) => u.email === email);
}