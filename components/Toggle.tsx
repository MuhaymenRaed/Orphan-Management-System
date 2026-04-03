import React from "react";
import { motion } from "framer-motion";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  className,
}) => {
  return (
    <label
      className={`inline-flex items-center cursor-pointer ${className || ""}`}
    >
      <input
        type="checkbox"
        className="sr-only peer"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <div
        className="w-11 h-6 rounded-full relative transition-colors duration-200"
        style={{
          background: checked ? "var(--primeColor)" : "var(--borderColor)",
        }}
      >
        <motion.div
          className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow"
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          animate={{ x: checked ? 20 : 0 }}
        />
      </div>
      {label && (
        <span className="ml-3 text-sm text-[var(--textColor)]">{label}</span>
      )}
    </label>
  );
};

export default Toggle;
