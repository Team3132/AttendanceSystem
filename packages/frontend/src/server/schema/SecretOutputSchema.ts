import { z } from "zod";

const SecretOutputSchema = z.object({
  secret: z.string(),
});
