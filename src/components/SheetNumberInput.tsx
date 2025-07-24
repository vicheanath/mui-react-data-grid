import React from "react";
import { SheetTextInput, type SheetInputProps } from "./SheetTextInput";

export const SheetNumberInput = React.memo(
  React.forwardRef<HTMLInputElement, SheetInputProps>(
    function SheetNumberInputComponent(props, ref) {
      return (
        <SheetTextInput
          ref={ref}
          {...props}
          onChange={(e) => {
            // Only allow numbers and decimal point
            const newValue = e.target.value.replace(/[^0-9.]/g, "");
            if (props.onChange) {
              const syntheticEvent = {
                ...e,
                target: {
                  ...e.target,
                  value: newValue,
                },
              };
              props.onChange(syntheticEvent);
            }
          }}
        />
      );
    }
  )
);