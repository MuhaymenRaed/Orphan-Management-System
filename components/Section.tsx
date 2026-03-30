import React from "react";
import { motion } from "framer-motion";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ title, children, className }) => (
  <motion.div
    className={`rounded-2xl bg-(--backgroundColor) border border-(--borderColor) p-6 mb-6 ${className || ""}`}
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, type: "spring", stiffness: 80, damping: 16 }}
  >
    <h2 className="text-lg font-bold mb-4 text-(--primeColor) text-right">
      {title}
    </h2>
    {children}
  </motion.div>
);

export default Section;
