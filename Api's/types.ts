import { Dispatch } from "redux";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface RequestConfig {
  url: string;
  method?: HttpMethod;
  data?: any;
  authToken?: string | null;
  params?: Record<string, any> | null;
  dispatch?: Dispatch<any>;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}
