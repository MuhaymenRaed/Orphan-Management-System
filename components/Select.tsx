import React from "react";
import { motion } from "framer-motion";

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  value,
  onChange,
  options,
  className,
}) => {
  return (
    <motion.select
      className={`rounded-xl border border-[var(--borderColor)] bg-[var(--fillColor)] px-3.5 py-2.5 text-sm text-[var(--textColor)] focus:outline-none focus:border-[var(--primeColor)] focus:ring-2 focus:ring-[var(--primeColor)]/20 transition-all duration-200 ${className || ""}`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      whileFocus={{ scale: 1.04 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{ outline: "none" }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </motion.select>
  );
};

export default Select;
