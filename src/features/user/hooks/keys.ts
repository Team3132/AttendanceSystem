export const userKeys = {
  all: ["users"] as const,
  users: () => [...userKeys.all, "users"] as const,
  user: (id: string) => [...userKeys.users(), id] as const,
  avatars: () => [...userKeys.all, "avatars"] as const,
  avatar: (id: string) => [...userKeys.avatars(), id] as const,
  outreachReports: () => [...userKeys.all, "outreachReports"] as const,
  outreachReport: (id: string) => [...userKeys.outreachReports(), id] as const,
};
