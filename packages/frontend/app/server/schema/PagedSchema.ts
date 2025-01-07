import { z } from "zod";

export function PagedSchema<TSchema extends z.ZodTypeAny>(schema: TSchema) {
	return z.object({
		items: z.array(schema),
		total: z.number(),
		page: z.number().describe("The current page"),
		nextPage: z.number().nullish(),
	});
}

export type PagedType = z.infer<ReturnType<typeof PagedSchema>>;
