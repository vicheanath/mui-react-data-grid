// --- Types ---
export interface DataRow {
  id: string;
  name: string;
  age: number | null;
  email: string;
  date?: string; // ISO date string
  money?: number;
}

export interface CellUpdatePayload {
  id: string;
  key: keyof DataRow;
  value: unknown;
}
