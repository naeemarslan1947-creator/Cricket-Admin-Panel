'use client';

import { useEffect, useState, useCallback } from 'react';
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
    _id?: string;
    user_name?: string;
    full_name?: string;
    name?: string;
    email?: string;
    phone_number?: string;
    profile_pic?: string;
    profile_media?: string;
    role?: { name?: string } | string | unknown[];
    role_id?: string | string[];
    address?: string;
    is_admin?: boolean;
    action_type?: number;
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

  const initializeAuth = useCallback(async () => {
    try {
      // Check if user is authenticated via localStorage and cookies
      const isAuth = localStorage.getItem('auth') === 'true';
      const storedUser = localStorage.getItem('user');
      
      if (!isAuth || !storedUser) {
        setIsLoading(false);
        return false;
      }

      // Get stored user data
      let storedUserData: AuthUser | null = null;
      try {
        storedUserData = JSON.parse(storedUser) as AuthUser;
      } catch (parseError) {
        console.error('Failed to parse stored user data:', parseError);
        setIsLoading(false);
        return false;
      }

      if (!storedUserData || !storedUserData._id) {
        setIsLoading(false);
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
            const fetchedUserData = userResponse.data.result;

            // Determine role based on fetched data
            const fetchedRoleId = fetchedUserData.role_id;
            const fetchedRoleName = Array.isArray(fetchedRoleId) && fetchedRoleId.length === 0
              ? 'Super Admin'
              : (typeof fetchedRoleId === 'string' ? fetchedRoleId : 'Moderator');

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
              name:  fetchedUserData.user_name || storedUserData.name,
              role: {
                id: typeof fetchedRoleId === 'string' ? fetchedRoleId : '',
                name: fetchedRoleName as 'Super Admin' | 'Moderator' | 'Support' | 'Developer',
                permissions: [],
                color: roleColors[fetchedRoleName] || 'blue',
              },
              avatar: fetchedUserData.profile_pic || fetchedUserData.profile_media || storedUserData.avatar,
              token: token,
              is_admin: fetchedUserData.is_admin ?? storedUserData.is_admin,
            };

            // Update Redux store and localStorage with fresh user data
            dispatch(setUser(updatedAuthUser));
            localStorage.setItem('user', JSON.stringify(updatedAuthUser));
          }
        } catch (userFetchError) {
          console.error('Failed to fetch fresh user data:', userFetchError);
          // Continue with stored user data if fetch fails
        }
      }

      setIsInitialized(true);
      setIsLoading(false);
      return true;
    } catch (err) {
      console.error('Auth initialization error:', err);
      setError(err instanceof Error ? err.message : 'Failed to initialize authentication');
      setIsLoading(false);
      return false;
    }
  }, [dispatch]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const refetch = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const result = await initializeAuth();
    return result;
  }, [initializeAuth]);

  return {
    isInitialized,
    isLoading,
    error,
    refetch,
  };
}

