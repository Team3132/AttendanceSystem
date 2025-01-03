import {
  Checkbox,
  FormControl,
  FormControlLabel,
  type FormControlLabelProps,
  FormHelperText,
} from "@mui/material";
import {
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
  useController,
} from "react-hook-form";

type ControlledCheckboxProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<
  FormControlLabelProps,
  "onChange" | "value" | "defaultValue" | "onBlur" | "error"
> &
  UseControllerProps<TFieldValues, TName>;

export default function ControlledCheckbox<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControlledCheckboxProps<TFieldValues, TName>) {
  const {
    control,
    name,
    rules,
    defaultValue,
    disabled,
    shouldUnregister,
    ...rest
  } = props;

  const { field, fieldState } = useController({
    control,
    name,
    defaultValue,
    rules,
    disabled,
    shouldUnregister,
  });

  return (
    <FormControl error={!!fieldState.error}>
      <FormControlLabel
        disabled={field.disabled}
        control={<Checkbox {...field} />}
        {...rest}
      />
      {fieldState.error ? (
        <FormHelperText error>{fieldState.error.message}</FormHelperText>
      ) : null}
    </FormControl>
  );
}
