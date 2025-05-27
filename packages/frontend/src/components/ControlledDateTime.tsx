import type { DateTimePickerProps } from "@mui/lab";
import { DateTimePicker, type PickerValidDate } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import {
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
  useController,
} from "react-hook-form";

type ControlledDateTimeProps<
  TDate extends PickerValidDate,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<
  DateTimePickerProps<TDate>,
  "onChange" | "value" | "defaultValue" | "onBlur" | "error"
> &
  UseControllerProps<TFieldValues, TName>;

export default function ControlledDateTime<
  TDate extends PickerValidDate,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControlledDateTimeProps<TDate, TFieldValues, TName>) {
  const {
    control,
    name,
    rules,
    defaultValue,
    disabled,
    shouldUnregister,
    helperText,
    ...rest
  } = props;

  const {
    field: { onChange, value, ...restField },
    fieldState,
  } = useController({
    control,
    name,
    defaultValue,
    rules,
    disabled,
    shouldUnregister,
  });

  return (
    <DateTimePicker
      value={value ? DateTime.fromJSDate(value) : null}
      label="Checkin Time"
      onChange={(date) => {
        onChange(date?.toJSDate());
      }}
      slotProps={{
        textField: {
          error: fieldState.error !== undefined,
          helperText: fieldState.error?.message,
        },
      }}
      {...rest}
      {...restField}
    />
  );
}
