"use client";

import { useState } from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { motion } from "framer-motion";

interface TwoFactorScreenProps {
  onVerify: (code: string) => Promise<void>;
  onBack: () => void;
  onResend: () => void;
  isLoading: boolean;
  error: string;
  pendingUserEmail?: string;
}

export function TwoFactorScreen({
  onVerify,
  onBack,
  onResend,
  isLoading,
  error,
  pendingUserEmail
}: TwoFactorScreenProps) {
  const [twoFactorCode, setTwoFactorCode] = useState(['', '', '', '', '', '']);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = twoFactorCode.join('');
    if (code.length === 6) {
      await onVerify(code);
    }
  };

  const handle2FAInput = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...twoFactorCode];
    newCode[index] = value;
    setTwoFactorCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`2fa-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handle2FAKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !twoFactorCode[index] && index > 0) {
      const prevInput = document.getElementById(`2fa-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <>
      {/* 2FA Header */}
      <div className="mb-8">
        <motion.button
          whileHover={{ x: -3 }}
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to login
        </motion.button>
        <h2 className="text-3xl text-gray-900 mb-2">
          Verify Your Identity
        </h2>
        <p className="text-gray-600">
          Enter the 6-digit code from your authenticator app
          {pendingUserEmail && (
            <span className="block text-sm text-gray-500 mt-1">
              For: <strong>{pendingUserEmail}</strong>
            </span>
          )}
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* 2FA Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 2FA Code Input */}
        <div>
          <label className="block text-sm text-gray-700 mb-4 text-center">
            Authentication Code
          </label>
          <div className="flex gap-3 justify-center mb-4">
            {twoFactorCode.map((digit, index) => (
              <motion.input
                key={index}
                id={`2fa-${index}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handle2FAInput(index, e.target.value)}
                onKeyDown={(e) => handle2FAKeyDown(index, e)}
                whileFocus={{ scale: 1.1 }}
                className="w-12 h-14 text-center text-2xl bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#007BFF]/20 focus:border-[#007BFF] focus:bg-white transition-all duration-200"
              />
            ))}
          </div>
          <p className="text-xs text-center text-gray-500">
            Demo: Enter any 6-digit code (e.g., 123456)
          </p>
        </div>

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={isLoading || twoFactorCode.join('').length !== 6}
          className="w-full py-4 px-4 bg-gradient-to-r from-[#007BFF] to-[#0056b3] hover:from-[#0056b3] hover:to-[#004085] text-white rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 relative overflow-hidden group"
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
              Verifying code...
            </span>
          ) : (
            <span className="relative z-10">Verify & Continue</span>
          )}
        </motion.button>

        {/* Resend Code */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Didn't receive the code?{' '}
            <motion.button
              whileHover={{ x: 3 }}
              type="button"
              onClick={onResend}
              className="text-[#007BFF] hover:text-[#0056b3] transition-colors"
            >
              Resend
            </motion.button>
          </p>
        </div>
      </form>

      {/* Security Info */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 pt-6 border-t border-gray-100"
      >
        <div className="flex items-start gap-3 text-xs text-gray-600 bg-blue-50 p-4 rounded-lg">
          <Shield className="w-4 h-4 text-[#007BFF] mt-0.5 shrink-0" />
          <p>
            Two-factor authentication adds an extra layer of security to your account. Your code expires in 30 seconds.
          </p>
        </div>
      </motion.div>
    </>
  );
}