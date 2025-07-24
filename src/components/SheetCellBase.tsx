import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";

interface SheetCellBaseProps {
  rowIndex: number;
  colIndex: number;
  focused: boolean;
  children: React.ReactNode;
  onFocus: () => void;
  onClick: () => void;
  padding?: number | string;
  name?: string;
}

export const SheetCellBase = React.forwardRef<
  HTMLDivElement,
  SheetCellBaseProps
>(function SheetCellBaseComponent(
  {
    rowIndex,
    colIndex,
    focused,
    children,
    onFocus,
    onClick,
    padding,
    name,
  },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focused && containerRef.current) {
      const input = containerRef.current.querySelector(
        "input, textarea, select"
      ) as HTMLInputElement | null;
      
      if (input) {
        input.focus();
        if (input.tagName === "INPUT" || input.tagName === "TEXTAREA") {
          input.select();
        }
      }
    }
  }, [focused]);

  return (
    <Box
      ref={(node) => {
        if (typeof ref === "function") ref(node as HTMLDivElement | null);
        else if (ref && typeof ref === "object" && ref !== null && "current" in ref) {
          (ref as React.RefObject<HTMLDivElement>).current = node as HTMLDivElement || undefined;
        }
        containerRef.current = node as HTMLDivElement | null;
      }}
      sx={{
        border: focused ? "2px solid #1976d2" : "1.5px solid transparent",
        borderRadius: 1,
        transition: "border 0.2s",
        width: "100%",
        height: "100%",
        p: padding === undefined ? 1 : padding,
        display: "flex",
        alignItems: "center",
        position: "relative",
        cursor: "pointer",
      }}
      tabIndex={0}
      data-row-index={rowIndex}
      data-col-index={colIndex}
      data-name={name}
      onFocus={onFocus}
      onClick={onClick}
    >
      {children}
    </Box>
  );
});