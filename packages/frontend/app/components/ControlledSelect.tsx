import {
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	Select,
	type SelectProps,
} from "@mui/material";
import { useId } from "react";
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
};

/**
 * Props for ControlledSelect
 */
type ControlledSelectProps<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<
	SelectProps,
	"onChange" | "value" | "defaultValue" | "onBlur" | "error" | "id" | "labelId"
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
		helperText,
		options,
		fullWidth,
		size,
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

	const selectId = useId();
	const labelId = `${selectId}-label`;
	const helperTextId = `${selectId}-helper-text`;

	const helperTextShown = !!(fieldState.error || helperText);

	return (
		<FormControl
			error={!!fieldState.error}
			fullWidth={fullWidth}
			size={size}
			disabled={disabled}
		>
			{rest.label ? <InputLabel id={labelId}>{rest.label}</InputLabel> : null}
			<Select
				{...rest}
				{...field}
				error={!!fieldState.error}
				disabled={disabled}
				id={selectId}
				labelId={rest.label ? labelId : undefined}
				aria-describedby={helperTextShown ? helperTextId : undefined}
				slotProps={{
					input: {
						placeholder: rest.placeholder,
					},
				}}
			>
				{options.map((option) => (
					<MenuItem key={option.value} value={option.value}>
						{option.label}
					</MenuItem>
				))}
			</Select>
			{helperTextShown ? (
				<FormHelperText id={helperTextId}>
					{fieldState.error ? fieldState.error.message : helperText}
				</FormHelperText>
			) : null}
		</FormControl>
	);
}
