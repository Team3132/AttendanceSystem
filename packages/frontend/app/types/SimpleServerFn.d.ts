/**
 * ({
   data,
 }: { data: z.infer<typeof NewEventParsingRuleSchema> }) => ReturnType<
   typeof createParsingRule
 >  

 Convert to generic type that given two generics, T and U returns the function signature above
 */
type UnpackAlt<T> = {
  [K in keyof T]: UnpackAlt<T[K]>;
};

export type SimpleServerFn<T, U> = ({
  data,
}: { data: UnpackAlt<z.infer<T>> }) => ReturnType<U>;
