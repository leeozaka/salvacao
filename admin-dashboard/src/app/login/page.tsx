"use client";

import { useState } from "react";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";
import { AnimatePresence, motion } from "framer-motion";

export default function AuthPage() {
  const [showLogin, setShowLogin] = useState(true);

  const handleRegisterSuccess = () => {
    setShowLogin(true);
  };

  return (
    // <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md overflow-hidden">
      <AnimatePresence mode="wait">
        {showLogin ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <LoginForm onToggleForm={() => setShowLogin(false)} />
          </motion.div>
        ) : (
          <motion.div
            key="register"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <RegisterForm
              onSuccess={handleRegisterSuccess}
              onToggleForm={() => setShowLogin(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    /* </div> */
  );
}
