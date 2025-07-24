import React, { useState } from "react";
import { GlobalStyles } from "@mui/material";
import type { SheetInputProps } from "./SheetTextInput";
import { SheetCellBase } from "./SheetCellBase";

export const SheetDateInput = React.memo(
  React.forwardRef<HTMLInputElement, SheetInputProps>(
    function SheetDateInputComponent(
      { rowIndex, colIndex, value, onChange, onBlur, name, padding },
      ref
    ) {
      const [focused, setFocused] = useState(false);
      // Format incoming ISO string value for native date input
      const valueString = value
        ? new Date(String(value)).toISOString().slice(0, 10)
        : "";


      console.log("SheetDateInput value:", value);
      // Simplified blur handler without validation
      const handleBlurField = () => {
        setFocused(false);
        onBlur();
      };

      return (
        <>
          <GlobalStyles
            styles={{
              ".hide-date-input::-webkit-calendar-picker-indicator": {
                display: "none",
              },
              ".hide-date-input::-webkit-inner-spin-button, .hide-date-input::-webkit-clear-button":
                { display: "none" },
              ".hide-date-input::-ms-clear, .hide-date-input::-ms-expand": {
                display: "none",
              },
            }}
          />
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
              <input
                className="hide-date-input"
                ref={ref}
                type="date"
                value={valueString}
                onChange={(e) => {
                  // Convert selected YYYY-MM-DD into full ISO string
                  const selectedDate = e.target.value;
                  const isoValue = new Date(selectedDate).toISOString();
                  const evt = {
                    target: { name: name ?? "", value: isoValue },
                  } as unknown as React.ChangeEvent<HTMLInputElement>;
                  onChange(evt);
                }}
                onBlur={handleBlurField}
                style={{
                  fontFamily: "monospace",
                  fontSize: 15,
                  padding: 0,
                  minWidth: 80,
                  width: "100%",
                  border: "none",
                  boxSizing: "border-box",
                  outline: "none",
                }}
                data-row-index={rowIndex}
                data-col-index={colIndex}
              />
            ) : (
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 15,
                  minWidth: 80,
                  color: valueString ? undefined : "#aaa",
                }}
              >
                {valueString || "-"}
              </span>
            )}
          </SheetCellBase>
        </>
      );
    }
  )
);
