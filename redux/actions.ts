import { LOADER, USER, TOAST, Toast } from "./actionTypes";

export const setLoader = (payload: boolean) => ({
  type: LOADER,
  payload,
});

export const setUser = (payload: any) => ({
  type: USER,
  payload,
});

export const showToast = (payload: Toast) => ({
  type: TOAST,
  payload,
});

export const clearToast = () => ({
  type: TOAST,
  payload: null,
});
