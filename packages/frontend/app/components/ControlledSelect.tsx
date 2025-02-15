import { MenuItem, TextField, type TextFieldProps } from "@mui/material";
import {
  type FieldPath,
  type FieldValues,
  type PathValue,
  type UseControllerProps,
  useController,
} from "react-hook-form";

/**
 * This is an option that inherits it's value from the type of the field
 */
type PathValueOption<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  /** The label of the option, may be any react node */
  label: React.ReactNode;
  /** The value of the option, may be any valid value */
  value: PathValue<TFieldValues, TName>;
  /** Disabled */
  disabled?: boolean;
};

/**
 * Props for ControlledSelect
 */
type ControlledSelectProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<
  TextFieldProps,
  "onChange" | "value" | "defaultValue" | "onBlur" | "error" | "select"
> &
  UseControllerProps<TFieldValues, TName> & {
    /** Helper text that appears */
    helperText?: string;
    /** The options for the select */
    options: Array<PathValueOption<TFieldValues, TName>>;
    placeholder?: string;
  };

/**
 * A controlled select component that uses react-hook-form
 * @param props Props for ControlledSelect
 * @returns A controlled select component
 */
export default function ControlledSelect<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(props: ControlledSelectProps<TFieldValues, TName>) {
  const {
    control,
    name,
    rules,
    defaultValue,
    disabled,
    shouldUnregister,
    options,
    ...rest
  } = props;

  const { field } = useController({
    control,
    name,
    defaultValue,
    rules,
    disabled,
    shouldUnregister,
  });

  return (
    <TextField select {...rest} {...field}>
      {options.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  );
}
