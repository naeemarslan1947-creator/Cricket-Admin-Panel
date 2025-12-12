"use client";

import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Shield } from 'lucide-react';
import { motion } from "framer-motion";

interface LoginScreenProps {
  onLogin: (email: string, password: string, remember: boolean) => Promise<void>;
  isLoading: boolean;
  error: string;
}

export function LoginScreen({
  onLogin,
  isLoading,
  error
}: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onLogin(email, password, rememberMe);
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl text-gray-900 mb-2">
          Welcome Back
        </h2>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className="block text-sm text-gray-700 mb-2">
            Email Address
          </label>
          <motion.div 
            animate={{ 
              scale: emailFocused ? 1.01 : 1,
            }}
            className="relative"
          >
            <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${emailFocused ? 'text-[#007BFF]' : 'text-gray-400'}`} />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocused(true)}
              onBlur={() => setEmailFocused(false)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007BFF]/20 focus:border-[#007BFF] focus:bg-white transition-all duration-200"
              placeholder="admin@crickit.com"
            />
          </motion.div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm text-gray-700 mb-2">
            Password
          </label>
          <motion.div 
            animate={{ 
              scale: passwordFocused ? 1.01 : 1,
            }}
            className="relative"
          >
            <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-200 ${passwordFocused ? 'text-[#007BFF]' : 'text-gray-400'}`} />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
              className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007BFF]/20 focus:border-[#007BFF] focus:bg-white transition-all duration-200"
              placeholder="••••••••••••"
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </motion.button>
          </motion.div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <motion.div 
            whileHover={{ x: 2 }}
            className="flex items-center"
          >
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 text-[#007BFF] focus:ring-[#007BFF] border-gray-300 rounded cursor-pointer transition-all"
            />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
              Remember me
            </label>
          </motion.div>

          <motion.a 
            whileHover={{ x: 3 }}
            href="#" 
            className="text-sm text-[#007BFF] hover:text-[#0056b3] transition-colors"
          >
            Forgot password?
          </motion.a>
        </div>

        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-4 bg-gradient-to-r from-[#007BFF] to-[#0056b3] hover:from-[#0056b3] hover:to-[#004085] text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 mt-6 relative overflow-hidden group"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6 }}
          />
          {isLoading ? (
            <span className="flex items-center justify-center relative z-10">
              <motion.svg 
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-5 h-5 text-white mr-3" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </motion.svg>
              Verifying credentials...
            </span>
          ) : (
            <span className="relative z-10">Sign In to Dashboard</span>
          )}
        </motion.button>
      </form>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-8 pt-6 border-t border-gray-100"
      >
        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
          <Shield className="w-4 h-4 text-[#00C853]" />
          <span>Secured with 256-bit SSL encryption</span>
        </div>
      </motion.div>
    </>
  );
}