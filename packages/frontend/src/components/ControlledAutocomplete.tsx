import {
  Autocomplete,
  type AutocompleteProps,
  type ChipTypeMap,
  TextField,
} from "@mui/material";
import {
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
  useController,
} from "react-hook-form";

type ControlledAutocompleteProps<
  Value,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
  ChipComponent extends React.ElementType = ChipTypeMap["defaultComponent"],
> = Omit<
  AutocompleteProps<Value, Multiple, DisableClearable, FreeSolo, ChipComponent>,
  "onChange" | "value" | "defaultValue" | "renderInput" | "onBlur" | "error"
> &
  UseControllerProps<TFieldValues, TName> & {
    label?: string;
    placeholder?: string;
    helperText?: string;
    required?: boolean;
  };

export default function ControlledAutocomplete<
  Value,
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  Multiple extends boolean | undefined = false,
  DisableClearable extends boolean | undefined = false,
  FreeSolo extends boolean | undefined = false,
  ChipComponent extends React.ElementType = ChipTypeMap["defaultComponent"],
>(
  props: ControlledAutocompleteProps<
    Value,
    TFieldValues,
    TName,
    Multiple,
    DisableClearable,
    FreeSolo,
    ChipComponent
  >,
) {
  const {
    control,
    name,
    rules,
    defaultValue,
    disabled,
    shouldUnregister,
    label,
    placeholder,
    helperText,
    required = false,
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
    <Autocomplete
      {...rest}
      renderInput={(params) => (
        <TextField
          {...params}
          helperText={fieldState.error ? fieldState.error.message : helperText}
          label={label}
          placeholder={placeholder}
          error={!!fieldState.error}
          disabled={disabled}
          required={required}
          InputLabelProps={{
            shrink: true,
          }}
        />
      )}
      value={field.value}
      onChange={(_, value) => {
        field.onChange(value);
      }}
      onBlur={field.onBlur}
      disabled={disabled}
    />
  );
}
