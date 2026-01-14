import { LOADER, USER, TOAST, NOTIFICATION_COUNT, Toast } from "./actionTypes";
import { ReduxUser } from "@/app/hooks/useAuth";

export const setLoader = (payload: boolean) => ({
  type: LOADER,
  payload,
});

export const setUser = (payload: ReduxUser | null) => ({
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

export const setNotificationCount = (payload: number) => ({
  type: NOTIFICATION_COUNT,
  payload,
});
