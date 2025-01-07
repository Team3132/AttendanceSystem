import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { eventQueryKeys } from "@/server/queryKeys";
import { createServerFn } from "@tanstack/start";
import { mentorMiddleware } from "@/middleware/authMiddleware";
import { CreateUserRsvpSchema } from "@/server/schema/CreateBlankUserRsvpSchema";
import { createUserRsvp } from "@/server/services/events.service";

const createUserRsvpFn = createServerFn({
	method: "POST",
})
	.middleware([mentorMiddleware])
	.validator(CreateUserRsvpSchema)
	.handler(async ({ data }) => createUserRsvp(data));

export default function useAddUserRsvp() {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createUserRsvpFn,
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: eventQueryKeys.eventRsvps(data.eventId),
			});
			queryClient.invalidateQueries({
				queryKey: eventQueryKeys.eventRsvp(data.eventId),
			});
		},
	});
}
