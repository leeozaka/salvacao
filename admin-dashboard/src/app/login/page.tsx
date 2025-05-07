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
  );
}
