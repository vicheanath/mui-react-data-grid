// components/SheetInputs.tsx
import React, { forwardRef, useState } from "react";
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import type { TextFieldProps } from "@mui/material/TextField";

// --- Common Input Props ---
export interface SheetInputPropsBase
  extends Omit<TextFieldProps, "onBlur" | "onFocus" | "inputRef"> {
  rowIndex: number;
  colIndex: number;
  onBlur: () => void;
  renderValue?: (value: string) => string;
  padding?: number | string;
}

/**
 * Props for SheetDateInput component
 */
export type SheetDateInputProps = SheetInputPropsBase;

const SheetDateInputComponent = (
  {
    rowIndex,
    colIndex,
    onBlur,
    value,
    renderValue,
    padding,
    // ...existing code...
    ...props
  }: SheetDateInputProps,
  ref: React.Ref<HTMLInputElement>
) => {
  const id = `cell-${rowIndex}-${colIndex}-${props.name ?? "date"}`;
  const [focused, setFocused] = useState(false);
  const handleBlur = () => {
    setFocused(false);
    let formattedValue = value;
    if (renderValue && typeof value === "string") {
      formattedValue = renderValue(value);
    }
    if (props.onChange) {
      props.onChange({
        target: {
          value: formattedValue,
          name: props.name ?? "date",
        },
      } as any);
    }
    onBlur();
  };
  return (
    <Box
      sx={{
        border: focused ? "2px solid #1976d2" : "1.5px solid transparent",
        transition: "border 0.2s",
        width: "100%",
        height: "100%",
        p: padding === undefined ? 1 : padding,
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
      tabIndex={0}
      onFocus={() => setFocused(true)}
      onBlur={handleBlur}
      data-row-index={rowIndex}
      data-col-index={colIndex}
    >
      <TextField
        inputRef={ref}
        id={id}
        type="date"
        variant="standard"
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={handleBlur}
        onChange={props.onChange}
        fullWidth
        slotProps={{
          input: {
            disableUnderline: true,
            style: {
              fontFamily: "monospace",
              fontSize: 15,
              padding: 0,
              minWidth: 80,
            },
            inputProps: {
              "data-row-index": rowIndex,
              "data-col-index": colIndex,
            },
          },
        }}
        {...props}
      />
    </Box>
  );
};
function dateInputAreEqual(
  prevProps: SheetDateInputProps,
  nextProps: SheetDateInputProps
) {
  return (
    prevProps.value === nextProps.value &&
    prevProps.rowIndex === nextProps.rowIndex &&
    prevProps.colIndex === nextProps.colIndex &&
    prevProps.name === nextProps.name
  );
}
export const SheetDateInput = React.memo(
  forwardRef(SheetDateInputComponent),
  dateInputAreEqual
);

/**
 * Props for SheetTextInput and SheetNumberInput components
 */
export type SheetTextInputProps = SheetInputPropsBase;
export type SheetNumberInputProps = SheetInputPropsBase;
type SheetInputProps = SheetInputPropsBase;

const SheetTextInputComponent = (
  {
    rowIndex,
    colIndex,
    onBlur,
    value,
    renderValue,
    padding,
    // ...existing code...
    ...props
  }: SheetInputProps,
  ref: React.Ref<HTMLInputElement>
) => {
  const id = `cell-${rowIndex}-${colIndex}-${props.name ?? "text"}`;
  const [focused, setFocused] = useState(false);
  const handleBlur = () => {
    setFocused(false);
    let formattedValue = value;
    if (renderValue && typeof value === "string") {
      formattedValue = renderValue(value);
    }
    if (props.onChange) {
      props.onChange({
        target: {
          value: formattedValue,
          name: props.name ?? "text",
        },
      } as any);
    }
    onBlur();
  };
  return (
    <Box
      sx={{
        border: focused ? "2px solid #1976d2" : "1.5px solid transparent",
        transition: "border 0.2s",
        width: "100%",
        height: "100%",
        p: padding === undefined ? 1 : padding,
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
    >
      <TextField
        inputRef={ref}
        id={id}
        variant="standard"
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={handleBlur}
        onChange={props.onChange}
        fullWidth
        slotProps={{
          input: {
            disableUnderline: true,
            style: {
              fontFamily: "monospace",
              fontSize: 15,
              padding: 0,
              minWidth: 80,
            },
            inputProps: {
              "data-row-index": rowIndex,
              "data-col-index": colIndex,
            },
          },
        }}
        {...props}
      />
    </Box>
  );
};
function textInputAreEqual(
  prevProps: SheetInputProps,
  nextProps: SheetInputProps
) {
  return (
    prevProps.value === nextProps.value &&
    prevProps.rowIndex === nextProps.rowIndex &&
    prevProps.colIndex === nextProps.colIndex &&
    prevProps.name === nextProps.name
  );
}
export const SheetTextInput = React.memo(
  forwardRef(SheetTextInputComponent),
  textInputAreEqual
);

const SheetNumberInputComponent = (
  {
    rowIndex,
    colIndex,
    onBlur,
    value,
    renderValue,
    padding,
    // ...existing code...
    ...props
  }: SheetInputProps,
  ref: React.Ref<HTMLInputElement>
) => {
  const id = `cell-${rowIndex}-${colIndex}-${props.name ?? "number"}`;
  const [focused, setFocused] = useState(false);
  // Show formatted value when not focused, raw value when focused
  const displayValue =
    !focused && renderValue && typeof value === "string"
      ? renderValue(value)
      : value;
  const handleBlur = () => {
    setFocused(false);
    onBlur();
  };
  return (
    <Box
      sx={{
        border: focused ? "2px solid #1976d2" : "1.5px solid transparent",
        transition: "border 0.2s",
        width: "100%",
        height: "100%",
        p: padding === undefined ? 1 : padding,
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
    >
      <TextField
        inputRef={ref}
        id={id}
        type="text"
        variant="standard"
        value={displayValue}
        onFocus={() => setFocused(true)}
        onBlur={handleBlur}
        onChange={props.onChange}
        fullWidth
        InputProps={{
          disableUnderline: true,
          style: {
            fontFamily: "monospace",
            fontSize: 15,
            padding: 0,
            minWidth: 80,
          },
          inputProps: {
            "data-row-index": rowIndex,
            "data-col-index": colIndex,
          },
        }}
        {...props}
      />
    </Box>
  );
};
function numberInputAreEqual(
  prevProps: SheetInputProps,
  nextProps: SheetInputProps
) {
  return (
    prevProps.value === nextProps.value &&
    prevProps.rowIndex === nextProps.rowIndex &&
    prevProps.colIndex === nextProps.colIndex &&
    prevProps.name === nextProps.name
  );
}
export const SheetNumberInput = React.memo(
  forwardRef(SheetNumberInputComponent),
  numberInputAreEqual
);

import type { SelectProps } from "@mui/material/Select";

/**
 * Props for SheetSelect component
 */
export interface SheetSelectProps
  extends Omit<
    SelectProps,
    "onBlur" | "onFocus" | "inputRef" | "children" | "onChange"
  > {
  rowIndex: number;
  colIndex: number;
  onBlur: () => void;
  options: { value: string; label: string }[];
  onChange?: (
    event: { target: { value: string; name: string } },
    child?: React.ReactNode
  ) => void;
  padding?: number | string;
}

const SheetSelectComponent = (
  {
    rowIndex,
    colIndex,
    onBlur,
    options,
    onChange,
    padding,
    // ...existing code...
    ...props
  }: SheetSelectProps,
  ref: React.ForwardedRef<HTMLInputElement | HTMLTextAreaElement>
) => {
  const id = `cell-${rowIndex}-${colIndex}-${props.name ?? "select"}`;
  const [focused, setFocused] = useState(false);
  // Use only focus state for styling, let MUI handle open/close
  const handleBoxFocus = () => setFocused(true);
  const handleBoxBlur = () => {
    setFocused(false);
    onBlur();
  };
  // Use MUI's default onChange, call custom onChange if provided
  const handleChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | (Event & { target: { value: unknown; name: string } }),
    child?: React.ReactNode
  ) => {
    if (onChange) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const value = (event.target as any).value ?? "";
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const name = (event.target as any).name ?? "";
      const syntheticEvent = {
        target: {
          value: String(value),
          name: String(name),
        },
      };
      onChange(syntheticEvent, child);
    }
  };
  return (
    <Box
      tabIndex={0}
      className="sheet-cell"
      sx={{
        border: focused ? "2px solid #1976d2" : "1.5px solid transparent",
        borderRadius: 2,
        transition: "border 0.2s",
        width: "100%",
        height: "100%",
        p: padding === undefined ? 1 : padding,
        display: "flex",
        alignItems: "center",
        position: "relative",
      }}
      onFocus={handleBoxFocus}
      onBlur={handleBoxBlur}
      data-row-index={rowIndex}
      data-col-index={colIndex}
    >
      <FormControl variant="standard" fullWidth>
        <InputLabel id={id + "-label"}>Select</InputLabel>
        <Select
          labelId={id + "-label"}
          inputRef={ref}
          id={id}
          value={props.value ?? ""}
          label="Select"
          inputProps={{
            style: { fontFamily: "monospace", fontSize: 15, minWidth: 80 },
            "data-row-index": rowIndex,
            "data-col-index": colIndex,
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            onBlur();
          }}
          onChange={handleChange}
          {...props}
        >
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
function selectAreEqual(
  prevProps: SheetSelectProps,
  nextProps: SheetSelectProps
) {
  return (
    prevProps.value === nextProps.value &&
    prevProps.rowIndex === nextProps.rowIndex &&
    prevProps.colIndex === nextProps.colIndex &&
    prevProps.name === nextProps.name &&
    JSON.stringify(prevProps.options) === JSON.stringify(nextProps.options)
  );
}
export const SheetSelect = React.memo(
  forwardRef(SheetSelectComponent),
  selectAreEqual
);
