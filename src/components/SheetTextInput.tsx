import React, { useState } from "react";
import { Box, TextField, type TextFieldProps } from "@mui/material";

export interface SheetInputProps
  extends Omit<TextFieldProps, "onBlur" | "onFocus" | "inputRef"> {
  rowIndex: number;
  colIndex: number;
  onBlur: () => void;
  renderValue?: (value: string) => string;
  padding?: number | string;
}

export const SheetTextInput = React.memo(
  React.forwardRef<HTMLInputElement, SheetInputProps>(
    function SheetTextInputComponent(
      { rowIndex, colIndex, onBlur, value, renderValue, padding, ...props },
      ref
    ) {
      const id = `cell-${rowIndex}-${colIndex}-${props.name ?? "text"}`;
      const [focused, setFocused] = useState(false);
      const handleBlur = () => {
        setFocused(false);
        let formattedValue = value;
        if (renderValue && typeof value === "string") {
          formattedValue = renderValue(value);
        }
        if (props.onChange) {
          const syntheticEvent = {
            target: {
              value: formattedValue,
              name: props.name ?? "text",
            },
          };
          props.onChange(
            syntheticEvent as unknown as React.ChangeEvent<HTMLInputElement>
          );
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
            cursor: focused ? undefined : "pointer",
          }}
          tabIndex={0}
          data-row-index={rowIndex}
          data-col-index={colIndex}
          onClick={() => setFocused(true)}
          onFocus={() => setFocused(true)}
        >
          {focused ? (
            <TextField
              inputRef={ref}
              id={id}
              variant="standard"
              value={value}
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
          ) : (
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 15,
                minWidth: 80,
                color: value ? undefined : "#aaa",
              }}
            >
              {String(
                renderValue && typeof value === "string"
                  ? renderValue(value)
                  : value || "-"
              )}
            </span>
          )}
        </Box>
      );
    }
  )
);