// hooks/useSheetNavigation.ts
import { useEffect, useCallback, type RefObject } from "react";

export const useSheetNavigation = (
  tableContainerRef: RefObject<HTMLDivElement>
) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!tableContainerRef.current) return;

      // Find the actual input/select inside the MUI Box wrapper
      let activeElement = document.activeElement;
      // If the focused element is not an input/select, but inside a .MuiBox-root, find the input/select inside
      if (activeElement && activeElement.classList.contains("MuiBox-root")) {
        const inner = activeElement.querySelector(
          "input, select"
        ) as HTMLElement | null;
        if (inner) activeElement = inner;
      }
      if (!activeElement) return;
      // Check for data-row-index and data-col-index
      const rowIndexAttr = (activeElement as HTMLElement).getAttribute(
        "data-row-index"
      );
      const colIndexAttr = (activeElement as HTMLElement).getAttribute(
        "data-col-index"
      );
      if (rowIndexAttr == null || colIndexAttr == null) return;

      const moveFocus = (direction: "up" | "down" | "left" | "right") => {
        e.preventDefault();
        const rowIndex = parseInt(rowIndexAttr);
        const colIndex = parseInt(colIndexAttr);
        let targetRow = rowIndex;
        let targetCol = colIndex;
        switch (direction) {
          case "up":
            targetRow = Math.max(0, rowIndex - 1);
            break;
          case "down":
            targetRow = rowIndex + 1;
            break;
          case "left":
            targetCol = Math.max(0, colIndex - 1);
            break;
          case "right":
            targetCol = colIndex + 1;
            break;
        }
        // Find any element with the correct data-row-index and data-col-index
        const selector = `[data-row-index="${targetRow}"][data-col-index="${targetCol}"]`;
        const nextElem = tableContainerRef.current.querySelector(
          selector
        ) as HTMLElement | null;
        if (nextElem) {
          // Try to focus the first focusable input/select/textarea inside the cell
          const focusable = nextElem.querySelector(
            "input, select, textarea, button"
          ) as HTMLElement | null;
          if (focusable) {
            focusable.focus();
            if (focusable instanceof HTMLInputElement) {
              focusable.select();
            }
          } else {
            nextElem.focus();
          }
        }
      };

      switch (e.key) {
        case "ArrowUp":
          moveFocus("up");
          break;
        case "ArrowDown":
          moveFocus("down");
          break;
        case "ArrowLeft":
          moveFocus("left");
          break;
        case "ArrowRight":
          moveFocus("right");
          break;
        case "Enter":
          e.preventDefault();
          moveFocus(e.shiftKey ? "up" : "down");
          break;
      }
    },
    [tableContainerRef]
  );

  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container) return;

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown, tableContainerRef]);
};
