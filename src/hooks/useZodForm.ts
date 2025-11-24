import { zodResolver } from "@hookform/resolvers/zod";
import { type FieldValues, type UseFormProps, useForm } from "react-hook-form";
import type { $ZodType, input, output } from "zod/v4/core";

export default function useZodForm<
  Input extends FieldValues,
  Output extends FieldValues,
  T extends $ZodType<Input, Output>,
>(
  props: { schema: T } & Omit<
    UseFormProps<input<T>, unknown, output<T>>,
    "resolver"
  >,
) {
  const form = useForm<input<T>, unknown, output<T>>({
    ...props,
    resolver: zodResolver(props.schema, undefined),
  });

  return form;
}
