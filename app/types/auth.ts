export interface RolePermission {
  _id?: string;
  name?: string;
  action?: string[];
  permission_type?: string;
  action_type?: number;
  updated_at?: string;
  created_at?: string;
  __v?: number;
}

export interface UserRole {
  id: string;
  name: "Super Admin" | "Moderator" | "Support" | "Developer";
  permissions: string[];
  color: string;
  _id?: string;
  permission?: RolePermission;
  action_type?: number;
  updated_at?: string;
  created_at?: string;
}

export interface AuthUser {
  _id?: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  token?: string;
  is_admin: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  result?: {
    data?: {
      item?: {
        status_code?: number;
        is_admin?: boolean;
        message?: string;
        token?: string;
        user?: AuthUser;
      };
    };
  };
  data?: {
    status_code?: number;
    result?: {
      is_admin?: boolean;
      user?: AuthUser;
    };
    token?: string;
    user?: AuthUser;
  };
  token?: string;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  data?: unknown;
}
