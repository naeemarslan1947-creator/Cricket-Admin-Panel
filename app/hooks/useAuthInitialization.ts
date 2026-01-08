'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { AuthUser } from '../types/auth';
import { setUser } from '../../redux/actions';
import makeRequest from "../../Api's/apiHelper";
import { UserGetById } from "../../Api's/repo";
import { tokenManager } from "../../Api's/tokenManager";

interface UserGetByIdResponse {
  response_code?: number;
  success?: boolean;
  status_code?: number;
  message?: string;
  result?: {
    data?: {
      _id?: string;
      user_name?: string;
      full_name?: string;
      name?: string;
      email?: string;
      phone_number?: string;
      profile_pic?: string;
      profile_media?: string;
      address?: string;
      is_admin?: boolean;
      is_user_verified?: boolean;
      is_club?: boolean;
      is_club_verified?: boolean;
      last_active?: string;
      action_type?: number;
      updated_at?: string;
      created_at?: string;
    };
    role?: Array<{
      _id?: string;
      user_id?: string;
      permission?: {
        _id?: string;
        name?: string;
        action?: string[];
        permission_type?: string;
        action_type?: number;
        updated_at?: string;
        created_at?: string;
        __v?: number;
      };
      action_type?: number;
      updated_at?: string;
      created_at?: string;
      __v?: number;
    }>;
    role_id?: string | string[];
  };
}

/**
 * Custom hook to initialize and persist authentication state
 * - Rehydrates user from localStorage on app initialization
 * - Fetches fresh user data from API on mount
 * - Keeps Redux store in sync with localStorage
 */
export function useAuthInitialization() {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isInitializedRef = useRef(false);

  const initializeAuth = useCallback(async () => {
    // Prevent multiple simultaneous initializations
    if (isInitializedRef.current) {
      return true;
    }

    try {
      // Check if user is authenticated via localStorage and cookies
      const isAuth = localStorage.getItem('auth') === 'true';
      const storedUser = localStorage.getItem('user');

      if (!isAuth || !storedUser) {
        return false;
      }

      // Get stored user data
      let storedUserData: AuthUser | null = null;
      try {
        storedUserData = JSON.parse(storedUser) as AuthUser;
      } catch (parseError) {
        console.error('Failed to parse stored user data:', parseError);
        return false;
      }

      if (!storedUserData || !storedUserData._id) {
        return false;
      }

      // Restore user to Redux store immediately from localStorage
      dispatch(setUser(storedUserData));

      // Get token and fetch fresh user data from API
      const token = tokenManager.getToken() || storedUserData.token;

      if (token && storedUserData._id) {
        try {
          const userResponse = await makeRequest<UserGetByIdResponse>({
            url: UserGetById,
            method: 'GET',
            params: { user_id: storedUserData._id },
          });

          if (userResponse.status === 200 && userResponse.data?.result) {
            const result = userResponse.data.result;
            const fetchedUserData = result.data;

            if (!fetchedUserData) {
              // Clear localStorage and redirect to login if user data not found
              localStorage.removeItem('auth');
              localStorage.removeItem('user');
              tokenManager.clearToken();
              document.cookie = 'auth=; path=/; max-age=0';
              document.cookie = 'auth_token=; path=/; max-age=0';
              return false;
            }

            // Extract role from the role array in response (role is at result level, not inside result.data)
            const roleArray = result.role || [];
            const firstRole = Array.isArray(roleArray) && roleArray.length > 0 ? roleArray[0] : null;
            
            // Get role name from permission object or default to Super Admin
            const fetchedRoleName = firstRole?.permission?.name || "Super Admin";
            const fetchedRoleId = firstRole?._id || (Array.isArray(result.role_id) ? result.role_id[0] : result.role_id);
            
            // Get permissions from permission object
            const fetchedPermissions = firstRole?.permission?.action || [];
            
            const roleColors: Record<string, string> = {
              'Super Admin': 'red',
              'Moderator': 'blue',
              'Support': 'green',
              'Developer': 'purple',
            };

            // Create updated auth user with complete data from API
            const updatedAuthUser: AuthUser = {
              _id: storedUserData._id,
              email: fetchedUserData.email || storedUserData.email,
              name: fetchedUserData.user_name || fetchedUserData.name || storedUserData.name,
              role: {
                id: typeof fetchedRoleId === 'string' ? fetchedRoleId : '',
                name: fetchedRoleName as 'Super Admin' | 'Moderator' | 'Support' | 'Developer',
                permissions: fetchedPermissions,
                color: roleColors[fetchedRoleName] || 'blue',
                _id: firstRole?._id,
                permission: firstRole?.permission,
                action_type: firstRole?.action_type,
                updated_at: firstRole?.updated_at,
                created_at: firstRole?.created_at,
              },
              avatar: fetchedUserData.profile_pic || fetchedUserData.profile_media || storedUserData.avatar,
              token: token,
              is_admin: fetchedUserData.is_admin ?? storedUserData.is_admin,
            };

            // Update Redux store and localStorage with fresh user data
            dispatch(setUser(updatedAuthUser));
            localStorage.setItem('user', JSON.stringify(updatedAuthUser));
          } else {
            // Clear localStorage and redirect to login if API response is invalid
            localStorage.removeItem('auth');
            localStorage.removeItem('user');
            tokenManager.clearToken();
            document.cookie = 'auth=; path=/; max-age=0';
            document.cookie = 'auth_token=; path=/; max-age=0';
            return false;
          }
        } catch (userFetchError) {
          console.error('Failed to fetch fresh user data:', userFetchError);
          // Clear localStorage and redirect to login on API error
          localStorage.removeItem('auth');
          localStorage.removeItem('user');
          tokenManager.clearToken();
          document.cookie = 'auth=; path=/; max-age=0';
          document.cookie = 'auth_token=; path=/; max-age=0';
          return false;
        }
      }

      isInitializedRef.current = true;
      return true;
    } catch (err) {
      console.error('Auth initialization error:', err);
      return false;
    }
  }, [dispatch]);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const result = await initializeAuth();
      if (isMounted) {
        setIsInitialized(result);
        setIsLoading(false);
      }
    };

    init();

    return () => {
      isMounted = false;
    };
  }, [initializeAuth]);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    isInitializedRef.current = false;
    const result = await initializeAuth();
    setIsInitialized(result);
    setIsLoading(false);
    return result;
  }, [initializeAuth]);

  return {
    isInitialized,
    isLoading,
    error,
    refetch,
  };
}

