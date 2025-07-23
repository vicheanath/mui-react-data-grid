import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import DataSheetRow from "./components/DataSheetRow";
import ActionCell from "./components/ActionCell";
import type { DataRow, CellUpdatePayload } from "./types";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";
import { debounce } from "lodash";

import { useSheetNavigation } from "./hooks/useSheetNavigation";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import {
  SheetNumberInput,
  SheetSelect,
  SheetTextInput,
  SheetDateInput,
} from "./components/SheetInputs";

// --- Types ---
// ...types moved to types.ts...

// --- Mock API Service ---
const apiService = {
  saveCell: async (payload: CellUpdatePayload): Promise<void> => {
    // Simulate API call
    console.log("Saving cell:", payload);
    return new Promise((resolve) => setTimeout(resolve, 500));
  },
  deleteRows: async (ids: string[]): Promise<void> => {
    // Simulate API call
    console.log("Deleting rows:", ids);
    return new Promise((resolve) => setTimeout(resolve, 500));
  },
  addRow: async (row: Omit<DataRow, "id">): Promise<string> => {
    // Simulate API call
    console.log("Adding row:", row);
    return new Promise((resolve) =>
      setTimeout(() => resolve(`new-${Date.now()}`), 500)
    );
  },
};

// --- Main DataSheet Component ---
export const DataSheet: React.FC<{ initialData?: DataRow[] }> = ({
  initialData = [],
}) => {
  // --- State ---
  const [data, setData] = useState<DataRow[]>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingSaves, setPendingSaves] = useState<CellUpdatePayload[]>([]);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // --- Keyboard Navigation ---
  useSheetNavigation(tableContainerRef as React.RefObject<HTMLDivElement>);

  // --- Handlers ---
  const handleCellChange = useCallback(
    (id: string, key: keyof DataRow, value: unknown) => {
      setData((prev) =>
        prev.map((row) => {
          if (row.id !== id) return row;
          // Only update if value is different
          if (row[key] === value) return row;
          return { ...row, [key]: value };
        })
      );
    },
    []
  );

  // Debounced save handler
  const handleSaveCell = useMemo(
    () =>
      debounce((id: string, key: keyof DataRow, value: unknown) => {
        setData((prev) => {
          const row = prev.find((r) => r.id === id);
          if (!row || row[key] === value) {
            // No change, skip save
            return prev;
          }
          setPendingSaves((pending) => [...pending, { id, key, value }]);
          // Update data for optimistic UI
          return prev.map((r) => (r.id === id ? { ...r, [key]: value } : r));
        });
      }, 300),
    []
  );

  // Add new row
  const addRow = useCallback(async () => {
    const newRow: Omit<DataRow, "id"> = {
      name: "",
      age: null,
      email: "",
      date: new Date().toISOString().slice(0, 10),
      status: "pending",
    };
    try {
      const newId = await apiService.addRow(newRow);
      setData((prev) => [...prev, { id: newId, ...newRow }]);
      // Focus first cell in new (last) row
      setTimeout(() => {
        const lastIndex =
          (tableContainerRef.current?.querySelectorAll("tr").length ?? 1) - 2; // -1 for thead, -1 for 0-index
        const firstCell = tableContainerRef.current?.querySelector(
          `[data-row-index="${lastIndex}"][data-col-index="0"]`
        ) as HTMLElement;
        firstCell?.focus();
      }, 100);
    } catch (error) {
      console.error("Failed to add row:", error);
    }
  }, []);

  // Delete a single row
  const deleteRow = useCallback(async (id: string) => {
    try {
      await apiService.deleteRows([id]);
      setData((prev) => prev.filter((row) => row.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }, []);

  // --- Table Columns ---
  const columns = useMemo<ColumnDef<DataRow>[]>(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        cell: ({ row, getValue }) => (
          <SheetTextInput
            rowIndex={row.index}
            colIndex={0}
            value={getValue() as string}
            onChange={(e) => {
              handleCellChange(row.original.id, "name", e.target.value);
              handleSaveCell(row.original.id, "name", e.target.value);
            }}
            onBlur={() =>
              handleSaveCell(row.original.id, "name", getValue() as string)
            }
            renderValue={(value) => value}
          />
        ),
      },
      {
        accessorKey: "age",
        header: "Age",
        cell: ({ row, getValue }) => (
          <SheetNumberInput
            rowIndex={row.index}
            colIndex={1}
            value={getValue() === null ? "" : (getValue() as number)}
            onChange={(e) => {
              const val = e.target.value === "" ? null : Number(e.target.value);
              handleCellChange(row.original.id, "age", val);
              handleSaveCell(row.original.id, "age", val);
            }}
            onBlur={() =>
              handleSaveCell(
                row.original.id,
                "age",
                getValue() as number | null
              )
            }
            renderValue={(value) => value.replace(/[^\d]/g, "")}
          />
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ row, getValue }) => (
          <SheetTextInput
            rowIndex={row.index}
            colIndex={2}
            value={getValue() as string}
            onChange={(e) => {
              handleCellChange(row.original.id, "email", e.target.value);
              handleSaveCell(row.original.id, "email", e.target.value);
            }}
            onBlur={() =>
              handleSaveCell(row.original.id, "email", getValue() as string)
            }
            renderValue={(value) => value.trim()}
          />
        ),
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row, getValue }) => (
          <SheetDateInput
            rowIndex={row.index}
            colIndex={3}
            value={getValue() as string}
            onChange={(e) => {
              handleCellChange(row.original.id, "date", e.target.value);
              handleSaveCell(row.original.id, "date", e.target.value);
            }}
            onBlur={() =>
              handleSaveCell(row.original.id, "date", getValue() as string)
            }
            renderValue={(value) => value.replaceAll("/", "-")}
          />
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row, getValue }) => (
          <SheetSelect
            rowIndex={row.index}
            colIndex={4}
            value={getValue() as string}
            onChange={(e) => {
              handleCellChange(row.original.id, "status", e.target.value);
              handleSaveCell(row.original.id, "status", e.target.value);
            }}
            onBlur={() =>
              handleSaveCell(row.original.id, "status", getValue() as string)
            }
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "pending", label: "Pending" },
            ]}
          />
        ),
      },
      {
        accessorKey: "money",
        header: "Money",
        cell: ({ row, getValue }) => {
          // Always pass a string to renderValue
          const rawValue = getValue();
          const valueStr =
            rawValue === null || rawValue === undefined ? "" : String(rawValue);
          return (
            <SheetNumberInput
              rowIndex={row.index}
              colIndex={5}
              value={valueStr}
              onChange={(e) => {
                const val =
                  e.target.value === ""
                    ? null
                    : Number(e.target.value.replace(/[^\d.-]/g, "")); // keep dash for negative numbers
                handleCellChange(row.original.id, "money", val);
                handleSaveCell(row.original.id, "money", val);
              }}
              onBlur={() => {
                // Format value as currency on blur
                const num = Number(valueStr);
                if (!isNaN(num)) {
                  handleCellChange(row.original.id, "money", num);
                  handleSaveCell(row.original.id, "money", num);
                } else {
                  handleCellChange(row.original.id, "money", null);
                  handleSaveCell(row.original.id, "money", null);
                }
              }}
              renderValue={(value) => {
                const num = Number(value);
                if (isNaN(num) || value === "") return "";
                return num.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                });
              }}
            />
          );
        },
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          // Show spinner if this row is being saved
          const isRowSaving = pendingSaves.some(
            (p) => p.id === row.original.id
          );
          return (
            <Box display="flex" alignItems="center" gap={1}>
              <ActionCell onDelete={() => deleteRow(row.original.id)} />
              {isRowSaving && (
                <CircularProgress size={18} thickness={5} color="primary" />
              )}
            </Box>
          );
        },
      },
    ],
    [handleCellChange, handleSaveCell, deleteRow, pendingSaves]
  );

  // --- Table Instance ---
  const table = useReactTable<DataRow>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (originalRow) => originalRow.id,
  });

  // --- Effect: Process Pending Saves ---
  useEffect(() => {
    if (pendingSaves.length === 0) return;
    setIsSaving(true);
    const processSaves = async () => {
      const toSave = Array.from(new Set(pendingSaves.map((s) => s.id)));
      for (const id of toSave) {
        const rowSaves = pendingSaves.filter((s) => s.id === id);
        try {
          await Promise.all(
            rowSaves.map((s) =>
              apiService.saveCell({ id: s.id, key: s.key, value: s.value })
            )
          );
          setData((prev) =>
            prev.map((row) => {
              if (row.id !== id) return row;
              const updatedRow = { ...row };
              for (const s of rowSaves) {
                (updatedRow as Record<string, unknown>)[s.key] = s.value;
              }
              return updatedRow;
            })
          );
        } catch (error) {
          console.error("Error saving row:", id, error);
        }
      }
      setPendingSaves((prev) => prev.filter((s) => !toSave.includes(s.id)));
    };
    processSaves().finally(() => setIsSaving(false));
  }, [pendingSaves]);

  return (
    <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
      <TableContainer
        ref={tableContainerRef}
        sx={{
          maxHeight: "calc(100vh - 200px)",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: 8,
            backgroundColor: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: 4,
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#555",
          },
        }}
      >
        <Table stickyHeader>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    sx={{
                      position: "sticky",
                      top: 0,
                      background: "#f5f5f5",
                      zIndex: 1,
                      borderBottom: "2px solid #1976d2",
                      p: 1,
                      whiteSpace: "nowrap",
                      fontWeight: "bold",
                      fontSize: "0.875rem",
                      color: "#333",
                      "&:last-child": { borderRight: 0 },
                    }}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        height: "100%",
                        padding: "0 8px",
                        userSelect: "none",
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <DataSheetRow
                key={row.id}
                row={row}
                pendingSaves={pendingSaves}
                deleteRow={deleteRow}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          p: 1,
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "#fafafa",
        }}
      >
        <Typography variant="body2" color="textSecondary">
          {data.length} row
          {data.length !== 1 && "s"} found.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={addRow}
          disabled={isSaving}
          sx={{
            borderRadius: 1,
            textTransform: "none",
            fontSize: "0.875rem",
            padding: "6px 12px",
          }}
        >
          {isSaving ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Add Row"
          )}
        </Button>
      </Box>
    </Paper>
  );
};
