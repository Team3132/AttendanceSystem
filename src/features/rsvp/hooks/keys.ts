export const rsvpKeys = {
  all: ["rsvps"] as const,
  events: () => [...rsvpKeys.all, "events"] as const,
  event: (event: string) => [...rsvpKeys.events(), event] as const,
};
