import { createFileRoute } from '@tanstack/react-router'
import { DateTime } from 'luxon';

export const Route = createFileRoute('/events')({
    loader: async ({ context: { queryUtils } }) => {
        const [initialAuth] = await Promise.all([
            queryUtils.auth.status.ensureData(),
            queryUtils.events.getEvents.prefetchInfinite({
                from: DateTime.now().startOf("day").toISO() ?? undefined,
                to:
                    DateTime.now().plus({ month: 1 }).startOf("day").toISO() ?? undefined,
                type: undefined,
                limit: 5,
            }),
        ]);

        return {
            initialAuth,
        };
    },
    component: () => <div>Hello /events/!</div>
})