

import { AxiosError } from "axios";

/**
 * API Error Handling Utilities
 */

// Error types classification
export const ErrorTypes = {
  NETWORK_ERROR: "NETWORK_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const;

export type ErrorType = typeof ErrorTypes[keyof typeof ErrorTypes];

// Interface for standardized error response
export interface ParsedError {
  type: ErrorType;
  status: number | null;
  message: string;
  details: unknown;
  originalError: AxiosError | unknown;
}

// Interface for notification function
export type NotifyUserFunction = (message: string, type?: "success" | "error" | "info" | "warning") => void;

/**
 * Parse error response and return a standardized error object
 * @param {AxiosError} error - The axios error object
 * @returns {ParsedError} Standardized error object
 */
export const parseApiError = (error: AxiosError | unknown): ParsedError => {
  // Default error structure
  const errorResponse: ParsedError = {
    type: ErrorTypes.UNKNOWN_ERROR,
    status: null,
    message: "An unknown error occurred",
    details: null,
    originalError: error,
  };

  // No response from server (network error)
  if (error instanceof Error && error.message === "Network Error") {
    return {
      ...errorResponse,
      type: ErrorTypes.NETWORK_ERROR,
      message: "Unable to connect to the server. Please check your internet connection.",
    };
  }

  // Server responded with an error
  if (error instanceof AxiosError && error.response) {
    errorResponse.status = error.response.status;

    // Extract error message and details from response if available
    const responseData = error.response.data;
    if (responseData && typeof responseData === 'object') {
      const data = responseData as { message?: string; error?: string; details?: unknown; errors?: unknown };
      errorResponse.message = data.message || data.error || error.message || "An error occurred";
      errorResponse.details = data.details || data.errors || null;
    }

    // Categorize by status code
    switch (error.response.status) {
      case 400:
        errorResponse.type = ErrorTypes.VALIDATION_ERROR;
        errorResponse.message = errorResponse.message || "Invalid request data";
        break;
      case 401:
        errorResponse.type = ErrorTypes.UNAUTHORIZED;
        errorResponse.message = errorResponse.message || "Authentication required";
        break;
      case 403:
        errorResponse.type = ErrorTypes.FORBIDDEN;
        errorResponse.message = errorResponse.message || "You do not have permission to access this resource";
        break;
      case 404:
        errorResponse.type = ErrorTypes.NOT_FOUND;
        errorResponse.message = errorResponse.message || "Resource not found";
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        errorResponse.type = ErrorTypes.SERVER_ERROR;
        errorResponse.message = errorResponse.message || "Server error occurred";
        break;
      default:
        errorResponse.type = ErrorTypes.UNKNOWN_ERROR;
    }
  }

  return errorResponse;
};

/**
 * Handle API errors with appropriate user feedback
 * @param {AxiosError | unknown} error - The axios error object
 * @param {NotifyUserFunction | null} notifyUser - Function to show notification to user (optional)
 * @returns {ParsedError} Parsed error object
 */
export const handleApiError = (error: AxiosError | unknown, notifyUser: NotifyUserFunction | null = null): ParsedError => {
  const parsedError = parseApiError(error);

  // Log error to console in development
  if (process.env.NODE_ENV !== "production") {
    console.error("API Error:", parsedError);
  }

  // Show notification to user if provided
  if (notifyUser && typeof notifyUser === "function") {
    notifyUser(parsedError.message, "error");
  }

  return parsedError;
};

const errorHandler = {
  ErrorTypes,
  parseApiError,
  handleApiError,
};

export default errorHandler;
