import React, { useRef, useState } from "react";
import { Box, ClickAwayListener, FormControl, InputLabel, MenuItem, Select, type SelectProps } from "@mui/material";



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




export const SheetSelect = React.memo(
  React.forwardRef<HTMLInputElement | HTMLTextAreaElement, SheetSelectProps>(
    function SheetSelectComponent(
      { rowIndex, colIndex, onBlur, options, onChange, padding, ...props },
      ref
    ) {
      const id = `cell-${rowIndex}-${colIndex}-${props.name ?? "select"}`;
      const [focused, setFocused] = useState(false);
      const [open, setOpen] = useState(false);
      const selectRef = useRef<any>(null);
      const handleBoxFocus = () => {
        setFocused(true);
        setOpen(true);
        setTimeout(() => {
          if (selectRef.current) {
            selectRef.current.focus();
          }
        }, 0);
      };
      const handleBoxBlur = () => {
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
        setOpen(false);
        setFocused(false);
        onBlur();
      };
      const selectedLabel =
        options.find((opt) => opt.value === props.value)?.label || "-";
      return (
        <ClickAwayListener onClickAway={handleBoxBlur} mouseEvent="onMouseDown">
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
              cursor: focused ? undefined : "pointer",
            }}
            onFocus={handleBoxFocus}
            data-row-index={rowIndex}
            data-col-index={colIndex}
            onClick={() => {
              setFocused(true);
              setOpen(true);
              setTimeout(() => {
                if (selectRef.current) {
                  selectRef.current.focus();
                }
              }, 0);
            }}
          >
            {focused ? (
              <FormControl variant="standard" fullWidth>
                <InputLabel id={id + "-label"}>Select</InputLabel>
                <Select
                  labelId={id + "-label"}
                  inputRef={(node) => {
                    if (ref) {
                      if (typeof ref === "function") ref(node);
                      else (ref as React.MutableRefObject<any>).current = node;
                    }
                    selectRef.current = node;
                  }}
                  id={id}
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
                  onFocus={() => {
                    setFocused(true);
                    setOpen(true);
                  }}
                  onBlur={() => {
                    setFocused(false);
                  }}
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
          </Box>
        </ClickAwayListener>
      );
    }
  )
);
