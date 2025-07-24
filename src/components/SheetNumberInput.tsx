import React, { useState } from "react";
import type { SheetInputProps } from "./SheetInputs";
import { Box, TextField } from "@mui/material";




export const SheetNumberInput = React.memo(
  React.forwardRef<HTMLInputElement, SheetInputProps>(
    function SheetNumberInputComponent(
      { rowIndex, colIndex, onBlur, value, renderValue, padding, ...props },
      ref
    ) {
      const id = `cell-${rowIndex}-${colIndex}-${props.name ?? "number"}`;
      const [focused, setFocused] = useState(false);
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
              type="text"
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