import React from "react";
import { motion } from "framer-motion";
import "../src/index.css";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  adj?: string;
  type?: "button" | "submit" | "reset"; // Added for form compatibility
  disabled?: boolean; // Added for loading states
}

function Button({
  children,
  onClick,
  adj,
  type = "button",
  disabled,
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center 
        transition-all duration-200 
        disabled:opacity-50 disabled:cursor-not-allowed
        ${adj}
      `}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: disabled ? 1 : 1.04 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ outline: "none" }}
    >
      {children}
    </motion.button>
  );
}

export default Button;
