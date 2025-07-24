import React, { useState } from "react";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { GlobalStyles } from "@mui/material";
import type { SheetInputProps } from "./SheetTextInput";
import { SheetCellBase } from "./SheetCellBase";

// Extend dayjs for strict parsing of YYYY-MM-DD
dayjs.extend(customParseFormat);

export const SheetDateInput = React.memo(
  React.forwardRef<HTMLInputElement, SheetInputProps>(
    function SheetDateInputComponent(
      { rowIndex, colIndex, value, onChange, onBlur, name, padding },
      ref
    ) {
      const [focused, setFocused] = useState(false);
      const [error, setError] = useState(false);
      const valueString = value === null ? "" : String(value);

      // On blur, validate and reformat
      const handleBlurField = () => {
        if (valueString) {
          const parsed = dayjs(valueString, "YYYY-MM-DD", true);
          if (!parsed.isValid()) {
            setError(true);
            return;
          }
          setError(false);
          const formatted = parsed.format("YYYY-MM-DD");
          if (formatted !== valueString) {
            const evt = {
              target: { name: name ?? "", value: formatted },
            } as React.ChangeEvent<HTMLInputElement>;
            onChange(evt);
          }
        } else {
          setError(false);
        }
        setFocused(false);
        onBlur();
      };

      return (
        <>
        <GlobalStyles
            styles={{
              ".hide-date-input::-webkit-calendar-picker-indicator": { display: "none" },
              ".hide-date-input::-webkit-inner-spin-button, .hide-date-input::-webkit-clear-button": { display: "none" },
              ".hide-date-input::-ms-clear, .hide-date-input::-ms-expand": { display: "none" },
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
                onChange={(e) =>
                  onChange(e as React.ChangeEvent<HTMLInputElement>)
                }
                onBlur={handleBlurField}
                style={{
                  fontFamily: "monospace",
                  fontSize: 15,
                  padding: 0,
                  minWidth: 80,
                  width: "100%",
                  border: "none",
                  boxSizing: "border-box",
                  outline: error ? "1px solid red" : "none",
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
