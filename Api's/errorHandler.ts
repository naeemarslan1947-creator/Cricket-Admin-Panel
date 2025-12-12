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
};

/**
 * Parse error response and return a standardized error object
 * @param {Error} error - The axios error object
 * @returns {Object} Standardized error object
 */
export const parseApiError = (error) => {
  // Default error structure
  const errorResponse = {
    type: ErrorTypes.UNKNOWN_ERROR,
    status: null,
    message: "An unknown error occurred",
    details: null,
    originalError: error,
  };

  // No response from server (network error)
  if (error.message === "Network Error") {
    return {
      ...errorResponse,
      type: ErrorTypes.NETWORK_ERROR,
      message:
        "Unable to connect to the server. Please check your internet connection.",
    };
  }

  // Server responded with an error
  if (error.response) {
    errorResponse.status = error.response.status;

    // Extract error message and details from response if available
    const responseData = error.response.data;
    if (responseData) {
      errorResponse.message =
        responseData.message || responseData.error || error.message;
      errorResponse.details =
        responseData.details || responseData.errors || null;
    }

    // Categorize by status code
    switch (error.response.status) {
      case 400:
        errorResponse.type = ErrorTypes.VALIDATION_ERROR;
        errorResponse.message = errorResponse.message || "Invalid request data";
        break;
      case 401:
        errorResponse.type = ErrorTypes.UNAUTHORIZED;
        errorResponse.message =
          errorResponse.message || "Authentication required";
        break;
      case 403:
        errorResponse.type = ErrorTypes.FORBIDDEN;
        errorResponse.message =
          errorResponse.message ||
          "You do not have permission to access this resource";
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
        errorResponse.message =
          errorResponse.message || "Server error occurred";
        break;
      default:
        errorResponse.type = ErrorTypes.UNKNOWN_ERROR;
    }
  }

  return errorResponse;
};

/**
 * Handle API errors with appropriate user feedback
 * @param {Error} error - The axios error object
 * @param {Function} notifyUser - Function to show notification to user (optional)
 * @returns {Object} Parsed error object
 */
export const handleApiError = (error, notifyUser = null) => {
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

export default {
  ErrorTypes,
  parseApiError,
  handleApiError,
};
