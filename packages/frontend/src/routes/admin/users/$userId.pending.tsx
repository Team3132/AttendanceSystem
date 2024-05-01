import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/users/$userId/pending')({
  loader: async ({ context: { queryUtils }, params }) => {
    const [initialUser, initialPendingEvents] = await Promise.all([
      await queryUtils.users.getUser.ensureData(params.userId),
      await queryUtils.users.getUserPendingRsvps.ensureData(params.userId),
    ]);

    return {
      userId: params.userId,
      initialUser,
      initialPendingEvents,
    };
  },
  component: () => <div>Hello /admin/users/$userId/pending!</div>
})