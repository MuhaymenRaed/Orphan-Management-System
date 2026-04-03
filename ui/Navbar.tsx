import {
  Baby,
  CreditCard,
  DollarSign,
  Heart,
  Home,
  Settings,
  Users,
  Eye,
} from "lucide-react";
import MyIcon from "../components/MyIcon";

import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import { useAuthUser, canAccess } from "../utils/Supabase/Auth/useAuthUser";

type NavbarProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

const navItems = [
  { icon: Home, label: "لوحة التحكم", path: "/overview", tab: "overview" },
  { icon: Baby, label: "الأيتام", path: "/orphans", tab: "orphans" },
  { icon: Users, label: "الكفلاء", path: "/sponsors", tab: "sponsors" },
  {
    icon: Heart,
    label: "الكفالات",
    path: "/sponsorships",
    tab: "sponsorships",
  },
  {
    icon: DollarSign,
    label: "الرواتب الشهرية",
    path: "/salaries",
    tab: "salaries",
  },
  {
    icon: CreditCard,
    label: "دفعات الكفلاء",
    path: "/payments",
    tab: "payments",
  },
  {
    icon: Eye,
    label: "بيانات اليتامى",
    path: "/orphan-receives",
    tab: "overview",
  },
  { icon: Users, label: "المستخدمون", path: "/users", tab: "users" },
  { icon: Settings, label: "الإعدادات", path: "/settings", tab: "settings" },
];

export default function Navbar({ isOpen, setIsOpen }: NavbarProps) {
  const { role } = useAuthUser();

  const visibleItems = navItems.filter((item) => canAccess(role, item.tab));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/30 z-30 cursor-pointer backdrop-blur-sm"
          />

          <motion.aside
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-72 max-w-[80vw] bg-[var(--backgroundColor)] border-l border-[var(--borderColor)] flex flex-col z-40 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-[var(--borderColor)] flex items-center justify-end gap-3">
              <div className="text-right">
                <h1 className="text-base font-bold text-[var(--textColor)]">
                  إدارة الأيتام
                </h1>
                <p className="text-[var(--textMuted)] text-xs">لوحة التحكم</p>
              </div>
              <MyIcon size={40} shape="rounded" color="var(--primeColor)">
                <Heart size={18} color="white" />
              </MyIcon>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5 custom-scrollbar">
              {visibleItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + index * 0.03 }}
                >
                  <NavLink
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-end gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                        isActive
                          ? "bg-[var(--primeColor)] text-white shadow-sm"
                          : "text-[var(--textColor)] hover:bg-[var(--fillColor)]"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                        <item.icon
                          size={18}
                          className={`shrink-0 ${isActive ? "text-white" : "text-[var(--primeColor)]"}`}
                        />
                      </>
                    )}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            {/* Footer */}
            <footer className="p-4 border-t border-[var(--borderColor)]">
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[var(--textMuted)] text-xs">المطور</span>
                <span className="text-[var(--textColor)] text-sm font-bold">
                  مهيمن رائد حميد
                </span>
              </div>
            </footer>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
