import { createStore, Store } from "redux";
import reducer from "./reducer";

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION__: any;
  }
}

// Create store
const store = createStore(
  reducer,
  // Add Redux DevTools Extension support
  typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION__
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : undefined
);

export default store;
