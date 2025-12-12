import { LOADER, USER, TOAST } from "./actionTypes";

interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "default";
  message: string;
  duration?: number;
}

interface AppState {
  loading: boolean;
  user: any;
  toasts: Toast[];
}

const initialState: AppState = {
  loading: false,
  user: null,
  toasts: [],
};

const reducer = (state = initialState, action: any): AppState => {
  switch (action.type) {
    case LOADER:
      return {
        ...state,
        loading: action.payload,
      };

    case USER:
      return {
        ...state,
        user: action.payload,
      };

    case TOAST:
      // If action.payload is null, clear all toasts
      if (action.payload === null) {
        return {
          ...state,
          toasts: [],
        };
      }
      // Add new toast
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      };

    default:
      return state;
  }
};

export default reducer;

// Export types for TypeScript support
export type RootState = ReturnType<typeof reducer>;
export type AppDispatch = typeof import("./store").default.dispatch;
