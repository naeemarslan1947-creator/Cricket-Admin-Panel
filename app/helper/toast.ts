import { toast, ToastOptions, ToastPosition, Id } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const defaultConfig: ToastOptions = {
  position: "top-right" as ToastPosition,
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light" as const,
  className: "top-right-toast",
  style: {
    top: "1rem",
    right: "1rem",
  } as React.CSSProperties,
};

interface ToastStyle extends React.CSSProperties {
  borderLeft?: string;
}

// Toast helper functions
export const toastSuccess = (message: string): Id => {
  return toast.success(message, {
    ...defaultConfig,
    style: {
      borderLeft: "4px solid #10B981",
      ...defaultConfig.style,
    } as ToastStyle,
  });
};

export const toastError = (message: string): Id => {
  return toast.error(message, {
    ...defaultConfig,
    style: {
      borderLeft: "4px solid #EF4444",
      ...defaultConfig.style,
    } as ToastStyle,
  });
};

export const toastInfo = (message: string): Id => {
  return toast.info(message, {
    ...defaultConfig,
    style: {
      borderLeft: "4px solid #3B82F6",
      ...defaultConfig.style,
    } as ToastStyle,
  });
};

export const toastWarning = (message: string): Id => {
  return toast.warning(message, {
    ...defaultConfig,
    style: {
      borderLeft: "4px solid #F59E0B",
      ...defaultConfig.style,
    } as ToastStyle,
  });
};