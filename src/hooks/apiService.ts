import type { CellUpdatePayload, DataRow } from "../types";


export const apiService = {
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
