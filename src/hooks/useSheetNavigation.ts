import { useEffect, useCallback, type RefObject } from "react";

export const useSheetNavigation = (
  tableContainerRef: RefObject<HTMLDivElement | null>
) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!tableContainerRef.current) return;

      // Find the actual input/select inside the cell
      let activeElement = document.activeElement as HTMLElement;

      // If focused on cell container, find its input
      if (
        activeElement?.dataset?.rowIndex &&
        !activeElement.querySelector("input, select")
      ) {
        const input = activeElement.querySelector(
          "input, select, textarea"
        ) as HTMLElement;
        if (input) activeElement = input;
      }

      // Check for data attributes
      const rowIndex = activeElement?.dataset?.rowIndex;
      const colIndex = activeElement?.dataset?.colIndex;

      if (!rowIndex || !colIndex) return;

      const moveFocus = (direction: "up" | "down" | "left" | "right") => {
        e.preventDefault();
        const currentRow = parseInt(rowIndex);
        const currentCol = parseInt(colIndex);

        let targetRow = currentRow;
        let targetCol = currentCol;

        switch (direction) {
          case "up":
            targetRow = Math.max(0, currentRow - 1);
            break;
          case "down":
            targetRow = currentRow + 1;
            break;
          case "left":
            targetCol = Math.max(0, currentCol - 1);
            break;
          case "right":
            targetCol = currentCol + 1;
            break;
        }

        // Find target cell
        const selector = `[data-row-index="${targetRow}"][data-col-index="${targetCol}"]`;
        const targetCell = tableContainerRef.current!.querySelector(
          selector
        ) as HTMLElement | null;

        if (targetCell) {
          targetCell.focus();

          // If user pressed a character key, start editing
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            const input = targetCell.querySelector("input, textarea");
            if (input && input instanceof HTMLInputElement) {
              input.value = e.key;
              input.setSelectionRange(1, 1);
            }
          }
        }
      };

      // Navigation keys
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
        case "Escape":
          if (
            activeElement.tagName === "INPUT" ||
            activeElement.tagName === "SELECT"
          ) {
            (activeElement as HTMLElement).blur();
          }
          break;
        default:
          // Start editing if a character key is pressed
          if (
            e.key.length === 1 &&
            !e.ctrlKey &&
            !e.metaKey &&
            activeElement.tagName !== "INPUT" &&
            activeElement.tagName !== "TEXTAREA" &&
            activeElement.tagName !== "SELECT"
          ) {
            const input = activeElement.querySelector("input");
            if (input && input instanceof HTMLInputElement) {
              input.value = e.key;
              input.focus();
              input.setSelectionRange(1, 1);
            }
          }
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
