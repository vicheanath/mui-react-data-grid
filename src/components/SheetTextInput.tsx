import React, { useState } from "react";
import { TextField } from "@mui/material";
import { SheetCellBase } from "./SheetCellBase";
import { ClickAwayListener } from "@mui/material";

export interface SheetInputProps {
  rowIndex: number;
  colIndex: number;
  onBlur: () => void;
  value: string | number | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  renderValue?: (value: string) => string;
  padding?: number | string;
  name?: string;
  /**
   * The HTML input type for the text field (e.g., "text", "date", "email").
   */
  type?: string;
}

export const SheetTextInput = React.memo(
  React.forwardRef<HTMLInputElement, SheetInputProps>(
    function SheetTextInputComponent(
      {
        rowIndex,
        colIndex,
        onBlur,
        value,
        renderValue,
        padding,
        name,
        onChange,
        ...props
      },
      ref
    ) {
      const [focused, setFocused] = useState(false);
      const stringValue = value === null ? "" : String(value);

      const handleBlur = () => {
        setFocused(false);
        onBlur();
      };

      const displayValue = renderValue
        ? renderValue(stringValue)
        : stringValue || "-";

      return (
        <ClickAwayListener onClickAway={handleBlur}>
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
              <TextField
                inputRef={ref}
                variant="standard"
                value={stringValue}
                onBlur={handleBlur}
                onChange={onChange}
                fullWidth
                autoFocus
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
                {displayValue}
              </span>
            )}
          </SheetCellBase>
        </ClickAwayListener>
      );
    }
  )
);
