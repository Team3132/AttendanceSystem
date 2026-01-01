import { DateTimePicker, type DateTimePickerProps } from "@mui/x-date-pickers";
import { DateTime } from "luxon";
import {
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
  useController,
} from "react-hook-form";

type ControlledDateTimeProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<
  DateTimePickerProps,
  "onChange" | "value" | "defaultValue" | "onBlur" | "error"
> &
  UseControllerProps<TFieldValues, TName> & {
    helperText?: string;
  };

export default function ControlledDateTime<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControlledDateTimeProps<TFieldValues, TName>) {
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
          helperText: fieldState.error?.message ?? helperText,
        },
      }}
      {...rest}
      {...restField}
    />
  );
}
