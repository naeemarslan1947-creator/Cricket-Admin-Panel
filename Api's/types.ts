

import { Dispatch } from "redux";

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface RequestConfig {
  url: string;
  method?: HttpMethod;
  data?: unknown;
  authToken?: string | null;
  params?: Record<string, unknown> | null;
  dispatch?: Dispatch;
}

export interface ApiResponse<T = unknown> {
  data?: T;
  status?: number;
  message?: string;
  success?: boolean;
  result?: T;
}


// Login response types
export interface LoginResponse {
  response_code?: number;
  success?: boolean;
  status_code?: number;
  message?: string;
  token?: string;
  result?: {
    data?: {
      _id?: string;
      user_name?: string;
      email?: string;
      first_name?: string;
      last_name?: string;
      is_admin?: boolean;
      profile_media?: unknown;
      [key: string]: unknown;
    };
    token?: string;
  };
  data?: unknown;
}

// API response with token
export interface ApiResponseWithToken<T = unknown> {
  data: T;
  status: number;
  token?: string;
  message?: string;
}


