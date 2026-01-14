// app/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Users, TrendingUp, BarChart3, Shield } from "lucide-react";
import { LoginScreen } from "../components/login/LoginScreen";

import { AuthUser, LoginResponse } from "../types/auth";
import makeRequest from "../../Api's/apiHelper";
import { LoginClientApiCall } from "../../Api's/repo";
import { handleApiError } from "../../Api's/errorHandler";
import store from "../../redux/store";
import { setUser } from "../../redux/actions";
import { tokenManager } from "../../Api's/tokenManager";
import { toastError, toastSuccess } from "../helper/toast";
import Loader from "../components/common/Loader";
import { getFreshFCMToken } from "../lib/firebase/firebase";

const statsData = [
  { icon: Users, label: "Active Users", value: "12.5K+", color: "from-blue-500 to-blue-600" },
  { icon: TrendingUp, label: "Growth Rate", value: "+45%", color: "from-green-500 to-green-600" },
  { icon: BarChart3, label: "Analytics", value: "Real-time", color: "from-purple-500 to-purple-600" },
];


interface ExtendedLoginResponse {
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
      full_name?: string;
      is_user_verified?: boolean;
      is_club?: boolean;
      is_club_verified?: boolean;
      action_type?: number;
      is_admin?: boolean;
      is_teenager?: boolean;
      updated_at?: string;
      created_at?: string;
      __v?: number;
      last_active?: string;
      profile_media?: string;
      role_id?: string | string[];
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
    token?: string;
  };
  misc_data?: string;
}

export default function LoginPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = localStorage.getItem('auth') === 'true';
      const storedUser = localStorage.getItem('user');
      const token = tokenManager.getToken();
      
      if (isAuth && storedUser && token) {
        // User is already authenticated, redirect to dashboard
        setIsAuthenticated(true);
        setIsCheckingAuth(false);
        router.push("/dashboard");
      } else {
        setIsCheckingAuth(false);
      }
    };
    
    // Small delay to ensure hydration
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, [router]);

  const handleLogin = async (email: string, password: string, remember: boolean): Promise<void> => {
    setIsLoading(true);
    setError("");

    try {
      // Get a fresh FCM token for login
      const fcmToken = await getFreshFCMToken();
      console.log("FCM Token for login:", fcmToken);

      const response = await makeRequest<LoginResponse>({
        url: LoginClientApiCall,
        method: "POST",
        data: { 
          email, 
          password,
          fcm_token: fcmToken,
        },
      });


      const loginData = response.data as ExtendedLoginResponse;

      const userData = loginData?.result?.data;
      const resultToken = loginData?.result?.token;
      const rootToken = loginData?.token;
      const roleData = loginData?.result?.role;
      
      const isAdmin = userData?.is_admin ?? false;

      const hasValidToken = !!(rootToken || resultToken || tokenManager.extractTokenFromResponse(loginData));

      // Check if API response indicates an error (success: false or response_code indicates error)
      const apiResponseCode = loginData?.response_code;
      const isApiError = !loginData?.success || (typeof apiResponseCode === 'number' && apiResponseCode >= 400);

      // Get the API error message
      const apiErrorMessage = loginData?.message || "";

      if (hasValidToken && isAdmin && !isApiError) {
        const userInfo = userData;
        const userId = userInfo?._id;
        
        // Extract role from the role array in response
        const roleArray = roleData || [];
        const firstRole = Array.isArray(roleArray) && roleArray.length > 0 ? roleArray[0] : null;
        
        // Get role name from permission object or default to Super Admin
        const roleName = firstRole?.permission?.name || "Super Admin";
        const roleId = firstRole?._id || userInfo?.role_id || "";
        
        // Get permissions from permission object
        const permissions = firstRole?.permission?.action || [];
        
        // Map role name to color
        const roleColors: Record<string, string> = {
          'Super Admin': 'red',
          'Moderator': 'blue',
          'Support': 'green',
          'Developer': 'purple',
        };
        
        const authUser: AuthUser = {
          _id: userId,
          email: userInfo?.email || email,
          name: userInfo?.full_name || userInfo?.user_name || "Unknown User",
          role: {
            id: typeof roleId === 'string' ? roleId : '',
            name: roleName as "Super Admin" | "Moderator" | "Support" | "Developer",
            permissions: permissions,
            color: roleColors[roleName] || 'blue',
            _id: firstRole?._id,
            permission: firstRole?.permission,
            action_type: firstRole?.action_type,
            updated_at: firstRole?.updated_at,
            created_at: firstRole?.created_at,
          },
          avatar: userInfo?.profile_media || undefined,
          token: rootToken || resultToken || tokenManager.extractTokenFromResponse(loginData) || "",
          is_admin: isAdmin
        };

        if (authUser.token) {
          tokenManager.setToken(authUser.token, true);
        }
        store.dispatch(setUser(authUser));
        localStorage.setItem("auth", "true");
        localStorage.setItem("user", JSON.stringify(authUser));
        document.cookie = "auth=true; path=/; max-age=86400"; // 1 day (session)
        document.cookie = `auth_token=${authUser.token}; path=/; max-age=86400; secure; samesite=strict`;

        if (remember) {
          document.cookie = "auth=true; path=/; max-age=604800"; // 7 days
          document.cookie = `auth_token=${authUser.token}; path=/; max-age=604800; secure; samesite=strict`;
          localStorage.setItem(
            "rememberedUser",
            JSON.stringify({
              email: authUser.email,
              name: authUser.name,
            })
          );
        }

        toastSuccess("Login successful! Redirecting to dashboard...");

        setTimeout(() => {
          router.push("/dashboard");
        }, 100);
      } else {
        // Build error message combining API error message and context
        let errorMsg = "";
        
        if (apiErrorMessage) {
          // If API returns an error message, display it with context
          if (!isAdmin) {
            errorMsg = `${apiErrorMessage} - You do not have admin access.`;
          } else {
            errorMsg = apiErrorMessage;
          }
        } else {
          // Fallback to default messages
          if (!isAdmin) {
            errorMsg = "You do not have admin access.";
          } else {
            errorMsg = "Invalid email or password.";
          }
        }
        
        setError(errorMsg);
        toastError(errorMsg);
      }
    } catch (err) {
      const parsedError = handleApiError(err);
      const errorMsg = parsedError.message;
      setError(errorMsg);
      toastError(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-50 via-blue-50/30 to-green-50/30">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-linear-to-br from-gray-50 via-blue-50/30 to-green-50/30 relative overflow-hidden">
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative">
        <div className="max-w-xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="flex items-center gap-4">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-14 h-14 bg-linear-to-br from-[#00C853] to-[#007BFF] rounded-2xl flex items-center justify-center shadow-2xl shadow-green-500/20"
              >
                <span className="text-white text-2xl">🏏</span>
              </motion.div>
              <div>
                <h1 className="text-3xl tracking-tight text-gray-900">CRICKET</h1>
                <p className="text-xs text-gray-500 tracking-widest mt-0.5">ADMIN PANEL</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-4xl text-gray-900 mb-4 leading-tight">
              Manage Your Cricket <br /> Platform with Ease
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Powerful admin tools designed for modern cricket management.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-3 gap-4 mb-12"
          >
            {statsData.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.05 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-100"
              >
                <div className={`w-10 h-10 bg-linear-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                  <stat.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl text-gray-900 mb-1">{stat.value}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-linear-to-br from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-100"
          >
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-[#007BFF]" />
              <h3 className="text-gray-900">Secure Admin Access</h3>
            </div>
            <p className="text-sm text-gray-600">
              Welcome to the Cricket Admin Panel. Please use your admin credentials to access the dashboard.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ duration: 0.5 }} 
          className="w-full max-w-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 md:p-10"
          >
            <LoginScreen onLogin={handleLogin} isLoading={isLoading} error={error} />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}