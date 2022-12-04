export const scancodeKeys = {
  all: ["scancodes"] as const,
  users: () => [...scancodeKeys.all, "users"] as const,
  user: (id: string) => [...scancodeKeys.users(), id] as const,
};
