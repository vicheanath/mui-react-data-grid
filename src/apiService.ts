import type { DataRow, CellUpdatePayload } from "./types";

export interface IApiService {
  saveCell(payload: CellUpdatePayload): Promise<void>;
  deleteRows(ids: string[]): Promise<void>;
  addRow(row: Omit<DataRow, "id">): Promise<string>;
}

export const defaultApiService: IApiService = {
  saveCell: async (payload: CellUpdatePayload): Promise<void> => {
    console.log("Saving cell:", payload);
    return new Promise((resolve) => setTimeout(resolve, 500));
  },
  deleteRows: async (ids: string[]): Promise<void> => {
    console.log("Deleting rows:", ids);
    return new Promise((resolve) => setTimeout(resolve, 500));
  },
  addRow: async (row: Omit<DataRow, "id">): Promise<string> => {
    console.log("Adding row:", row);
    return new Promise((resolve) =>
      setTimeout(() => resolve(`new-${Date.now()}`), 500)
    );
  },
};
