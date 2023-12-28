import { z } from "zod";

export function PagedSchema<TSchema extends z.ZodTypeAny>(schema: TSchema) {
  return z.object({
    items: z.array(schema),
    nextCursor: z.string().nullish(),
    total: z.number(),
  });
}

export type PagedType = z.infer<ReturnType<typeof PagedSchema>>;
