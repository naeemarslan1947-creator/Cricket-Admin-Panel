import axios, { AxiosRequestConfig, AxiosError } from "axios";
import store from "../redux/store";
import { setLoader, showToast } from "../redux/actions";
import { ApiResponse, RequestConfig } from "./types";

/**
 * Configures the request headers based on auth token and content type
 */
const configureHeaders = (
  authToken: string | null,
  isFormData: boolean = false
): Record<string, string> => {
  const headers: Record<string, string> = {};

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

/**
 * Makes an HTTP request with the provided configuration
 * @template T - The expected response data type
 */
const makeRequest = async <T = any,>({
  url,
  method = "GET",
  data = null,
  authToken = null,
  params = null,
}: Omit<RequestConfig, "dispatch">): Promise<ApiResponse<T>> => {
  store.dispatch(setLoader(true));

  try {
    const isFormData = data instanceof FormData;

    const config: AxiosRequestConfig = {
      url,
      method,
      headers: configureHeaders(authToken, isFormData),
      params,
      data: data || undefined,
    };

    const response = await axios(config);
    store.dispatch(setLoader(false));

    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    const axiosError = error as AxiosError;
    store.dispatch(setLoader(false));

    // Show error toast
    store.dispatch(
      showToast({
        id: Date.now().toString(),
        type: "error",
        message: axiosError.message || "An error occurred",
        duration: 5000,
      })
    );

    throw {
      data: axiosError.response?.data,
      status: axiosError.response?.status || 500,
      message: axiosError.message,
    };
  }
};

export default makeRequest;
