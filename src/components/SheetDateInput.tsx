import React, { useState } from "react";
import type { SheetInputProps } from "./SheetTextInput";
import { SheetCellBase } from "./SheetCellBase";
import { ClickAwayListener } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

/**
 * A date input cell that uses HTML date picker.
 */
export const SheetDateInput = React.memo(
  React.forwardRef<HTMLInputElement, SheetInputProps>(
    function SheetDateInputComponent(
      { rowIndex, colIndex, value, onChange, onBlur, name, padding },
      ref
    ) {
      const [focused, setFocused] = useState(false);
      const dateValue: Dayjs | null = value ? dayjs(String(value)) : null;
      const displayValue = dateValue
        ? dateValue.toISOString().slice(0, 10)
        : "";

      return (
        <ClickAwayListener
          onClickAway={() => {
            setFocused(false);
            onBlur();
          }}
        >
          <SheetCellBase
            rowIndex={rowIndex}
            colIndex={colIndex}
            focused={focused}
            padding={padding}
            name={name}
            onFocus={() => setFocused(true)}
            onClick={() => setFocused(true)}
          >
            {focused ? (
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  format="yyyy-MM-dd"
                  value={dateValue}
                  onChange={(date) => {
                    const newVal = date ? date.toISOString().slice(0, 10) : "";
                    const event = {
                      target: { value: newVal, name: name ?? "" },
                    } as unknown as React.ChangeEvent<HTMLInputElement>;
                    onChange(event);
                  }}
                  onAccept={onBlur}
                  onClose={onBlur}
                  slotProps={{
                    textField: {
                      inputRef: ref,
                      variant: "standard",
                      onBlur,
                      fullWidth: true,
                      InputProps: {
                        disableUnderline: true,
                        style: {
                          fontFamily: "monospace",
                          fontSize: 15,
                          padding: 0,
                          minWidth: 80,
                        },
                      },
                      inputProps: {
                        "data-row-index": rowIndex,
                        "data-col-index": colIndex,
                      },
                    },
                  }}
                />
              </LocalizationProvider>
            ) : (
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 15,
                  minWidth: 80,
                  color: displayValue ? undefined : "#aaa",
                }}
              >
                {displayValue || "-"}
              </span>
            )}
          </SheetCellBase>
        </ClickAwayListener>
      );
    }
  )
);
