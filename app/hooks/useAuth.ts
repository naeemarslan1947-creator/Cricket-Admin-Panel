'use client';

import { useCallback } from 'react';
import { TypedUseSelectorHook,  useSelector } from 'react-redux';
import { RootState } from '@/redux/reducer';

// Define a flexible user type that matches what's stored in Redux
export interface ReduxUser {
  name?: string;
  full_name?: string;
  user_name?: string;
  email?: string;
  avatar?: string;
  profile_pic?: string;
  profile_media?: string;
  role?: {
    id?: string;
    name?: string;
    permissions?: string[];
    color?: string;
  };
  role_id?: string | string[];
  is_admin?: boolean;
  _id?: string;
  token?: string;
}

// Use typed selector hook
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Custom hook to access authenticated user data
 * Provides helper functions for common user operations
 */
export function useAuth() {
  const user = useAppSelector((state) => state.user) as ReduxUser | null | undefined;
  const isLoading = useAppSelector((state) => state.loading);

  // Helper to get user display name
  const getUserName = useCallback(() => {
    if (user?.name) return user.name;
    if (user?.full_name) return user.full_name;
    if (user?.user_name) return user.user_name;
    return 'Admin User';
  }, [user]);

  // Helper to get user role name
  const getUserRole = useCallback(() => {
    if (user?.role?.name) return user.role.name;
    if (user?.role_id) return user.role_id;
    return 'Super Admin';
  }, [user]);

  // Helper to get user avatar URL
  const getUserAvatar = useCallback(() => {
    if (user?.avatar) return user.avatar;
    if (user?.profile_pic) return user.profile_pic;
    if (user?.profile_media) return user.profile_media;
    return null;
  }, [user]);

  // Helper to get avatar initial
  const getAvatarInitial = useCallback(() => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  }, [getUserName]);

  // Check if user is authenticated
  const isAuthenticated = useCallback(() => {
    return !!user && !!user._id && !!user.token;
  }, [user]);

  // Check if user has specific role
  const hasRole = useCallback((roleName: string) => {
    return user?.role?.name === roleName || user?.role_id === roleName;
  }, [user]);

  // Check if user has specific permission
  const hasPermission = useCallback((permission: string) => {
    return user?.role?.permissions?.includes(permission) ?? false;
  }, [user]);

  return {
    user,
    isLoading,
    getUserName,
    getUserRole,
    getUserAvatar,
    getAvatarInitial,
    isAuthenticated,
    hasRole,
    hasPermission,
  };
}

