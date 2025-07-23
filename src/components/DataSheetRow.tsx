import React from "react";
import { TableRow, TableCell, Box, CircularProgress } from "@mui/material";
import { flexRender, type Row } from "@tanstack/react-table";
import ActionCell from "./ActionCell";
import type { CellUpdatePayload, DataRow } from "../types";

interface DataSheetRowProps {
  row: Row<DataRow>;
  pendingSaves: CellUpdatePayload[];
  deleteRow: (id: string) => void;
  style?: React.CSSProperties;
}

const DataSheetRow = React.memo<DataSheetRowProps>(
  ({ row, pendingSaves, deleteRow, style }) => {
    return (
      <TableRow
        key={row.id}
        hover
        sx={{ transition: "background 0.2s" }}
        style={style}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell
            key={cell.id}
            sx={{
              borderRight: "1px solid #d1d5db",
              borderBottom: "1px solid #d1d5db",
              p: 0,
              minWidth: 80,
              height: 44,
              position: "relative",
              background: "white",
              "&:last-child": { borderRight: 0 },
            }}
          >
            <Box
              width="100%"
              height="100%"
              display="flex"
              alignItems="center"
              tabIndex={-1}
            >
              {cell.column.id === "actions"
                ? (() => {
                    const isRowSaving = pendingSaves.some(
                      (p) => p.id === row.original.id
                    );
                    return (
                      <Box display="flex" alignItems="center" gap={1}>
                        <ActionCell
                          onDelete={() => deleteRow(row.original.id)}
                        />
                        {isRowSaving && (
                          <CircularProgress
                            size={18}
                            thickness={5}
                            color="primary"
                          />
                        )}
                      </Box>
                    );
                  })()
                : flexRender(cell.column.columnDef.cell, cell.getContext())}
            </Box>
          </TableCell>
        ))}
      </TableRow>
    );
  }
);

export default DataSheetRow;
