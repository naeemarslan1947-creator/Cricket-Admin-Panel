export const LOADER = "LOADER" as const;
export const USER = "USER" as const;
export const TOAST = "TOAST" as const;

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}

export type ActionType =
  | { type: typeof LOADER; payload: boolean }
  | { type: typeof USER; payload: any }
  | { type: typeof TOAST; payload: Toast };
