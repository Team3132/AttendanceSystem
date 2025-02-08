import { json } from "@tanstack/start";
import { z } from "zod";

const ErrorLiteral = z.union([
  z.literal("NOT_FOUND"),
  z.literal("UNAUTHORIZED"),
  z.literal("FORBIDDEN"),
  z.literal("BAD_REQUEST"),
  z.literal("INTERNAL_SERVER_ERROR"),
]);

const ErrorSchema = z.object({
  code: ErrorLiteral,
  message: z.string(),
});

interface ServerErrorOptions {
  code: z.infer<typeof ErrorLiteral>;
  message: string;
}

export const createServerError = ({ code, message }: ServerErrorOptions) => {
  return json(
    {
      code,
      message,
    },
    {
      status: 500,
    },
  );
};

export const isServerError = (
  error: unknown,
): error is z.infer<typeof ErrorSchema> => {
  return ErrorSchema.safeParse(error).success;
};
