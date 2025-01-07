import { useMutation, useQueryClient } from "@tanstack/react-query";
import { eventQueryKeys } from "@/server/queryKeys";
import { UserCheckinSchema } from "@/server/schema/UserCheckinSchema";
import { createServerFn } from "@tanstack/start";
import { mentorMiddleware } from "@/middleware/authMiddleware";
import { userCheckin } from "@/server/services/events.service";

const userCheckinFn = createServerFn({
	method: "POST",
})
	.middleware([mentorMiddleware])
	.validator(UserCheckinSchema)
	.handler(async ({ data }) => userCheckin(data));

export default function useCheckinUser() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: userCheckinFn,
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: eventQueryKeys.eventRsvps(data.eventId),
			});
		},
	});
}
