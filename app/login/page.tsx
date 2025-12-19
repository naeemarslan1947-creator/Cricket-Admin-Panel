// app/login/page.tsx
"use client";

import { useState } from "react";
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
const statsData = [
  { icon: Users, label: "Active Users", value: "12.5K+", color: "from-blue-500 to-blue-600" },
  { icon: TrendingUp, label: "Growth Rate", value: "+45%", color: "from-green-500 to-green-600" },
  { icon: BarChart3, label: "Analytics", value: "Real-time", color: "from-purple-500 to-purple-600" },
];


interface ExtendedLoginResponse {
  response_code?: number;
  success?: boolean;
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
    };
    token?: string;
  };
  misc_data?: string;
}

export default function LoginPage() {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (email: string, password: string, remember: boolean): Promise<void> => {
    setIsLoading(true);
    setError("");

    try {
      const response = await makeRequest<LoginResponse>({
        url: LoginClientApiCall,
        method: "POST",
        data: { email, password },
      });

      const loginData = response.data as ExtendedLoginResponse;

      // Extract user data from actual API response structure
      const userData = loginData?.result?.data;
      const resultToken = loginData?.result?.token;
      const rootToken = loginData?.token;
      
      console.log("📢[page.tsx:65]: userData: ", userData);
      console.log("📢[page.tsx:66]: resultToken: ", resultToken);
      console.log("📢[page.tsx:67]: rootToken: ", rootToken);

      // Determine if user is admin from actual response
      const isAdmin = userData?.is_admin ?? false;

      // Check for valid token from multiple possible locations
      const hasValidToken = !!(rootToken || resultToken || tokenManager.extractTokenFromResponse(loginData));


      console.log("📢[page.tsx:74]: isAdmin: ", isAdmin);
      console.log("📢[page.tsx:75]: hasValidToken: ", hasValidToken);

      if (hasValidToken && isAdmin) {
        // Extract user info from actual response structure
        const userInfo = userData;
        
        // Create auth user object with proper typing
        const authUser: AuthUser = {
          email: userInfo?.email || email,
          name: userInfo?.full_name || userInfo?.user_name || "Unknown User",
          role: {
            id: "",
            name: "Moderator",
            permissions: [],
            color: "blue"
          },
          avatar: userInfo?.profile_media || undefined,
          token: rootToken || resultToken || tokenManager.extractTokenFromResponse(loginData) || "",
          is_admin: isAdmin
        };

        console.log("📢[page.tsx:89]: authUser created: ", authUser);

        // Store token in tokenManager
        if (authUser.token) {
          tokenManager.setToken(authUser.token, true);
          console.log("📢[page.tsx:93]: Token stored in tokenManager");
        }

        // Save to Redux store
        store.dispatch(setUser(authUser));
        console.log("📢[page.tsx:97]: User saved to Redux store");


        // Save session to localStorage
        localStorage.setItem("auth", "true");
        localStorage.setItem("user", JSON.stringify(authUser));
        console.log("📢[page.tsx:101]: Session saved to localStorage");

        // Always set authentication cookies for middleware protection
        document.cookie = "auth=true; path=/; max-age=86400"; // 1 day (session)
        document.cookie = `auth_token=${authUser.token}; path=/; max-age=86400; secure; samesite=strict`;
        console.log("📢[page.tsx:105]: Authentication cookies set");

        if (remember) {
          // Extended cookies for remember me functionality
          document.cookie = "auth=true; path=/; max-age=604800"; // 7 days
          document.cookie = `auth_token=${authUser.token}; path=/; max-age=604800; secure; samesite=strict`;
          localStorage.setItem(
            "rememberedUser",
            JSON.stringify({
              email: authUser.email,
              name: authUser.name,
            })
          );
          console.log("📢[page.tsx:115]: Remember me cookies set");
        }


        console.log("📢[page.tsx:117]: About to redirect to dashboard");
        
        // Use setTimeout to ensure all state updates are processed first
        setTimeout(() => {
          console.log("📢[page.tsx:120]: Executing router.push to dashboard");
          router.push("/dashboard");
        }, 100);
      } else {
        if (!isAdmin) {
          setError("You do not have admin access.");
        } else {
          setError(loginData?.message || "Invalid email or password.");
        }
      }
    } catch (err) {
      const parsedError = handleApiError(err);
      setError(parsedError.message);
    } finally {
      setIsLoading(false);
    }
  };

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

