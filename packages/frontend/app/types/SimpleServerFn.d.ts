export type SimpleServerFn<
  ZodInput extends ZodType,
  // biome-ignore lint/suspicious/noExplicitAny: any is needed here to allow for any function signature
  HandlerFn extends (...args: any[]) => any,
> = ({ data }: { data: z.infer<ZodInput> }) => ReturnType<HandlerFn>;
