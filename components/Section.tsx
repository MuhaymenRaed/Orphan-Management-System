import React from "react";
import { motion } from "framer-motion";

interface SectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Section: React.FC<SectionProps> = ({ title, children, className }) => (
  <motion.div
    className={`rounded-2xl bg-[var(--backgroundColor)] border border-[var(--borderColor)] p-5 md:p-6 mb-5 shadow-[var(--cardShadow)] ${className || ""}`}
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, type: "spring", stiffness: 100, damping: 18 }}
  >
    <h2 className="text-base font-bold mb-3 text-[var(--primeColor)] text-right">
      {title}
    </h2>
    {children}
  </motion.div>
);

export default Section;
