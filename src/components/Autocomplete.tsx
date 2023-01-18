import {
  Badge,
  Box,
  Button,
  Checkbox,
  color,
  Divider,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Popover,
  PopoverAnchor,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Radio,
  RadioGroup,
  Stack,
  Tag,
  useBoolean,
  Wrap,
} from "@chakra-ui/react";
import { useCombobox, UseComboboxProps } from "downshift";
import React, { useEffect, useMemo, useState } from "react";

type AutocompleteProps<D extends unknown> = Omit<
  UseComboboxProps<D>,
  "onInputValueChange" | "inputValue" | "items"
> & {
  filter: (items: D[], input: string) => D[];
  options: D[];
  onChange: (newVal: D[]) => void;
  value: D[]
};

export default function Autocomplete<D>({
  filter,
  options,
  value: selectedItems,
  ...props
}: AutocompleteProps<D>) {
  const [inputValue, onInputValueChange] = useState<string>("");

  const items = useMemo(() => {
    return filter(options, inputValue);
  }, [options, inputValue]);

  useEffect(() => {
    props.onChange(selectedItems);
  }, [selectedItems]);

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    highlightedIndex,
    getItemProps,
    selectedItem,
  } = useCombobox({
    ...props,
    items,
    stateReducer: (state, actionAndChanges) => {
      const { changes, type } = actionAndChanges;
      switch (type) {
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            isOpen: true, // keep menu open after selection.
            highlightedIndex: state.highlightedIndex,
            inputValue: "", // don't add the item string as input value at selection.
          };
        case useCombobox.stateChangeTypes.InputBlur:
          return {
            ...changes,
            inputValue: "", // don't add the item string as input value at selection.
          };
        default:
          return changes;
      }
    },
    onSelectedItemChange: ({ selectedItem }) => {
      if (!selectedItem) {
        return;
      }
      const index = selectedItems.indexOf(selectedItem);
      if (index > 0) {
        props.onChange([
          ...selectedItems.slice(0, index),
          ...selectedItems.slice(index + 1),
        ]);
      } else if (index === 0) {
        props.onChange([...selectedItems.slice(1)]);
      } else {
        props.onChange([...selectedItems, selectedItem]);
      }
    },
    selectedItem: null,
    inputValue,
    onInputValueChange: ({ inputValue: newInputValue }) =>
      onInputValueChange(newInputValue ?? ""),
  });

  return (
    <Popover
      isOpen={isOpen}
      closeOnBlur={false}
      isLazy
      placement="bottom-start"
      lazyBehavior="keepMounted"
    >
      <PopoverAnchor>
        <Input {...getInputProps()} />
      </PopoverAnchor>

      <PopoverContent>
        <PopoverBody>
          <Box {...getMenuProps()} as="ul" overflow={"scroll"}>
            {isOpen && (
              <Stack divider={<Divider />}>
                {items.map((item, index) => (
                  <HStack
                    as="li"
                    key={index}
                    {...getItemProps({ item, index })}
                  >
                    <Checkbox
                      isChecked={selectedItems.includes(item)}
                      {...getItemProps({ item, index })}
                    >
                      <Tag>
                        {props.itemToString && props.itemToString(item)}
                      </Tag>
                    </Checkbox>
                  </HStack>
                ))}
              </Stack>
            )}
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
