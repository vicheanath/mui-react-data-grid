import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
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
import { SheetTextInput } from "./components/SheetTextInput";
import { SheetSelect } from "./components/SheetSelect";
import { SheetNumberInput } from "./components/SheetNumberInput";
import { SheetDateInput } from "./components/SheetDateInput";
import DataSheetRow from "./components/DataSheetRow";
import ActionCell from "./components/ActionCell";
import { defaultApiService, type IApiService } from "./apiService";
import type { DataRow, CellUpdatePayload } from "./types";

const createColumn = <T extends keyof DataRow>(
  key: T,
  header: string,
  handleCellChange: (id: string, key: keyof DataRow, value: unknown) => void,
  handleSaveCell: (id: string, key: keyof DataRow, value: unknown) => void,
  inputType: "text" | "number" | "select" | "date" = "text",
  options?: { value: string; label: string }[],
  colIndex: number = 0
): ColumnDef<DataRow> => ({
  accessorKey: key,
  header,
  cell: ({ row, getValue }) => {
    const rawValue = getValue() as DataRow[T] | undefined | null;
    const value = rawValue ?? "";
    const commonProps = {
      rowIndex: row.index,
      colIndex,
      value,
      onBlur: () => {},
      name: key,
    };

    switch (inputType) {
      case "select":
        return (
          <SheetSelect
            {...commonProps}
            options={options || []}
            onChange={(e) => {
              const value = e.target.value as DataRow[T];
              handleCellChange(row.original.id, key, value);
              handleSaveCell(row.original.id, key, value);
            }}
          />
        );
      case "number":
        return (
          <SheetNumberInput
            {...commonProps}
            onChange={(e) => {
              const val = e.target.value === "" ? null : Number(e.target.value);
              handleCellChange(row.original.id, key, val);
              handleSaveCell(row.original.id, key, val);
            }}
            onBlur={() => {
              handleSaveCell(row.original.id, key, getValue());
            }}
            renderValue={(value) => {
              if (value === "" || value === null) return "-";
              if (key === "money") {
                return Number(value).toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                });
              }
              return String(value);
            }}
          />
        );
      case "date":
        return (
          <SheetDateInput
            {...commonProps}
            onChange={(e) => {
              const val = e.target.value as DataRow[T];
              handleCellChange(row.original.id, key, val);
              handleSaveCell(row.original.id, key, val);
            }}
            onBlur={() => {
              handleSaveCell(row.original.id, key, getValue());
            }}
          />
        );
      case "text":
      default:
        return (
          <SheetTextInput
            {...commonProps}
            onChange={(e) => {
              handleCellChange(row.original.id, key, e.target.value);
              handleSaveCell(row.original.id, key, e.target.value);
            }}
            onBlur={() => {
              handleSaveCell(row.original.id, key, getValue());
            }}
            renderValue={(value) => {
              if (value === "" || value === null) return "-";
              return String(value);
            }}
          />
        );
    }
  },
});

interface DataSheetProps {
  initialData?: DataRow[];
  apiService?: IApiService;
}

const DataSheet: React.FC<DataSheetProps> = ({
  initialData = [],
  apiService = defaultApiService,
}) => {
  // State
  const [data, setData] = useState<DataRow[]>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [pendingSaves, setPendingSaves] = useState<CellUpdatePayload[]>([]);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  // Ref to track last saved data to prevent redundant saves
  const savedDataRef = useRef<Record<string, DataRow>>({});

  // Handlers
  // Initialize savedDataRef with initialData
  useEffect(() => {
    const map: Record<string, DataRow> = {};
    initialData.forEach((row) => {
      map[row.id] = { ...row };
    });
    savedDataRef.current = map;
  }, [initialData]);
  // Handlers
  const handleCellChange = useCallback(
    (id: string, key: keyof DataRow, value: unknown) => {
      setData((prev) =>
        prev.map((row) => (row.id === id ? { ...row, [key]: value } : row))
      );
    },
    []
  );

  const handleSaveCell = useMemo(
    () =>
      debounce((id: string, key: keyof DataRow, value: unknown) => {
        // only enqueue if changed from last saved value
        const last = savedDataRef.current[id]?.[key];
        if (last !== value) {
          setPendingSaves((pending) => [...pending, { id, key, value }]);
        }
      }, 300),
    []
  );

  const addRow = useCallback(async () => {
    const newRow: Omit<DataRow, "id"> = {
      name: "",
      age: null,
      email: "",
      date: new Date().toISOString(),
      money: undefined,
    };

    try {
      const newId = await apiService.addRow(newRow);
      const newRowComplete = { id: newId, ...newRow };
      setData((prev) => [...prev, newRowComplete]);
      savedDataRef.current[newId] = { ...newRowComplete };

      // Focus first cell in new row
      setTimeout(() => {
        const newRowIndex = data.length;
        const firstCell = tableContainerRef.current?.querySelector(
          `[data-row-index="${newRowIndex}"][data-col-index="0"]`
        ) as HTMLElement;
        firstCell?.focus();
      }, 100);
    } catch (error) {
      console.error("Failed to add row:", error);
    }
  }, [apiService, data.length]);

  const deleteRow = useCallback(
    async (id: string) => {
      try {
        await apiService.deleteRows([id]);
        setData((prev) => prev.filter((row) => row.id !== id));
        delete savedDataRef.current[id];
      } catch (error) {
        console.error("Delete failed:", error);
      }
    },
    [apiService]
  );

  // Columns
  const columns = useMemo<ColumnDef<DataRow>[]>(
    () => [
      createColumn(
        "name",
        "Name",
        handleCellChange,
        handleSaveCell,
        "text",
        undefined,
        0
      ),
      createColumn(
        "age",
        "Age",
        handleCellChange,
        handleSaveCell,
        "number",
        undefined,
        1
      ),
      createColumn(
        "email",
        "Email",
        handleCellChange,
        handleSaveCell,
        "text",
        undefined,
        2
      ),
      createColumn(
        "date",
        "Date",
        handleCellChange,
        handleSaveCell,
        "date",
        undefined,
        3
      ),
      createColumn(
        "money",
        "Balance",
        handleCellChange,
        handleSaveCell,
        "number",
        undefined,
        4
      ),
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <ActionCell onDelete={() => deleteRow(row.original.id)} />
        ),
      },
    ],
    [deleteRow, handleCellChange, handleSaveCell]
  );

  // Table instance
  const table = useReactTable<DataRow>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row.id,
  });

  // Virtualization
  const rowVirtualizer = useVirtualizer({
    count: table.getRowModel().rows.length,
    getScrollElement: () => tableContainerRef.current,
    estimateSize: () => 48,
    overscan: 20,
  });

  // Navigation
  useSheetNavigation(tableContainerRef);

  // Process pending saves
  useEffect(() => {
    if (pendingSaves.length === 0) return;

    const processSaves = async () => {
      setIsSaving(true);
      const saveMap = new Map<string, CellUpdatePayload[]>();

      // Group saves by row ID
      pendingSaves.forEach((save) => {
        if (!saveMap.has(save.id)) saveMap.set(save.id, []);
        saveMap.get(save.id)?.push(save);
      });

      // Process each row's saves
      for (const [id, saves] of saveMap.entries()) {
        try {
          await Promise.all(saves.map((save) => apiService.saveCell(save)));
          // update saved values to prevent redundant future saves
          const rowData = savedDataRef.current[id];
          if (rowData) {
            saves.forEach((save) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (rowData as any)[save.key] = save.value;
            });
          }
        } catch (error) {
          console.error("Error saving row:", id, error);
        }
      }

      // Remove processed saves
      setPendingSaves((prev) => prev.filter((save) => !saveMap.has(save.id)));
    };

    processSaves().finally(() => setIsSaving(false));
  }, [pendingSaves, apiService]);

  return (
    <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden", p: 1 }}>
      <TableContainer
        ref={tableContainerRef}
        sx={{
          maxHeight: "70vh",
          overflowY: "auto",
          "&::-webkit-scrollbar": { width: 8 },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#888",
            borderRadius: 4,
          },
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    sx={{
                      position: "sticky",
                      top: 0,
                      background: "#f5f7fa",
                      zIndex: 1,
                      borderBottom: "2px solid #1976d2",
                      p: 1,
                      fontWeight: "bold",
                    }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {rowVirtualizer.getVirtualItems().length > 0 && (
              <tr
                style={{
                  height: `${rowVirtualizer.getVirtualItems()[0].start}px`,
                }}
              />
            )}

            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = table.getRowModel().rows[virtualRow.index];
              return (
                <DataSheetRow
                  key={row.id}
                  row={row}
                  pendingSaves={pendingSaves}
                  deleteRow={deleteRow}
                  style={{ height: 48 }}
                />
              );
            })}

            {rowVirtualizer.getVirtualItems().length > 0 && (
              <tr
                style={{
                  height: `${
                    rowVirtualizer.getTotalSize() -
                    (rowVirtualizer.getVirtualItems().at(-1)?.end || 0)
                  }px`,
                }}
              />
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "#fafafa",
        }}
      >
        <Typography variant="body2" color="textSecondary">
          {data.length} row{data.length !== 1 && "s"}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={addRow}
          disabled={isSaving}
          startIcon={
            isSaving ? (
              <CircularProgress size={20} color="inherit" />
            ) : undefined
          }
          sx={{ minWidth: 120 }}
        >
          {isSaving ? "Saving..." : "Add Row"}
        </Button>
      </Box>
    </Paper>
  );
};

export default DataSheet;
