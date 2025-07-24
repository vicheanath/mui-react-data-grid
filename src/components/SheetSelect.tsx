/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  ClickAwayListener,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectProps,
} from "@mui/material";
import { SheetCellBase } from "./SheetCellBase";

export interface SheetSelectProps
  extends Omit<SelectProps, "onBlur" | "onFocus" | "inputRef" | "children" | "onChange"> {
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

export const SheetSelect = React.memo(
  React.forwardRef<HTMLInputElement | HTMLTextAreaElement, SheetSelectProps>(
    function SheetSelectComponent(
      { rowIndex, colIndex, onBlur, options, onChange, padding, ...props },
      ref
    ) {
      const [focused, setFocused] = useState(false);
      const [open, setOpen] = useState(false);

      const handleFocus = () => {
        setFocused(true);
        setOpen(true);
      };

      const handleBlur = () => {
        setFocused(false);
        setOpen(false);
        onBlur();
      };

      const handleChange = (
        event:
          | React.ChangeEvent<HTMLInputElement>
          | (Event & { target: { value: unknown; name: string } }),
        child?: React.ReactNode
      ) => {
        if (onChange) {
          const value = String((event.target as any).value ?? "");
          const name = String((event.target as any).name ?? "");
          const syntheticEvent = {
            target: {
              value,
              name,
            },
          };
          onChange(syntheticEvent, child);
        }
        setOpen(false);
        setFocused(false);
        onBlur();
      };

      const selectedLabel =
        options.find((opt) => opt.value === props.value)?.label || "-";

      return (
        <ClickAwayListener onClickAway={handleBlur} mouseEvent="onMouseDown">
          <SheetCellBase
            rowIndex={rowIndex}
            colIndex={colIndex}
            focused={focused}
            padding={padding}
            name={props.name}
            onFocus={handleFocus}
            onClick={handleFocus}
          >
            {focused ? (
              <FormControl variant="standard" fullWidth>
                <InputLabel>Select</InputLabel>
                <Select
                  inputRef={(node) => {
                    if (ref) {
                      if (typeof ref === "function") ref(node);
                      else (ref as React.MutableRefObject<any>).current = node;
                    }
                  }}
                  value={props.value ?? ""}
                  label="Select"
                  open={open}
                  onOpen={() => setOpen(true)}
                  onClose={() => setOpen(false)}
                  inputProps={{
                    style: {
                      fontFamily: "monospace",
                      fontSize: 15,
                      minWidth: 80,
                    },
                    "data-row-index": rowIndex,
                    "data-col-index": colIndex,
                  }}
                  onFocus={handleFocus}
                  onBlur={() => setFocused(false)}
                  onChange={handleChange}
                  autoFocus
                  {...props}
                >
                  {options.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 15,
                  minWidth: 80,
                  color: props.value ? undefined : "#aaa",
                }}
              >
                {String(selectedLabel)}
              </span>
            )}
          </SheetCellBase>
        </ClickAwayListener>
      );
    }
  )
);