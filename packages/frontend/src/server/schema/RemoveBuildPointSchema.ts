import { z } from "zod";

export const RemoveBuildPointSchema = z.object({
  buildPointId: z.string(),
});
