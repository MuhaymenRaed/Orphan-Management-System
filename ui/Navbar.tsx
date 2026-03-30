import { Baby, DollarSign, Heart, Home, Settings, Users } from "lucide-react";
import MyIcon from "../components/MyIcon";
import Button from "../components/Button";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";

type NavbarProps = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

const navItems = [
  { icon: Home, label: "لوحة التحكم", path: "/overview" },
  { icon: Baby, label: "الأيتام", path: "/orphans" },
  { icon: Users, label: "المستخدمون", path: "/users" },
  { icon: Users, label: "الكفلاء", path: "/sponsors" },
  { icon: Heart, label: "الكفالات", path: "/sponsorships" },
  { icon: DollarSign, label: "الرواتب الشهرية", path: "/salaries" },
  { icon: Settings, label: "الإعدادات", path: "/settings" },
];

export default function Navbar({ isOpen, setIsOpen }: NavbarProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Visible on all screens when open */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 z-30 cursor-pointer backdrop-blur-sm"
          />

          {/* Navbar */}
          <motion.aside
            initial={{ x: "100%", opacity: 0 }} // Start from right for Arabic RTL feel
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-72 max-w-[80vw] 
            bg-(--backgroundColor) border-l-2 border-(--borderColor)
            flex flex-col z-40 shadow-2xl overflow-hidden"
          >
            {/* Header Area */}
            <div className="p-6 border-b-2 border-(--borderColor) flex items-center justify-end gap-4">
              <div className="text-right">
                <h1 className="text-lg font-bold text-(--textColor)">
                  إدارة الأيتام
                </h1>
                <p className="text-(--textMuted) text-xs">مؤسسة خيرية</p>
              </div>
              <MyIcon size={44} shape="rounded" color="var(--primeColor)">
                <Heart size={20} color="white" />
              </MyIcon>
            </div>

            {/* Scrollable Navigation Items */}
            <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-3 custom-scrollbar">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <NavLink
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `block rounded-xl transition-all ${
                        isActive ? "ring-2 ring-(--primeColor) shadow-md" : ""
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <Button
                        adj={`w-full py-3.5 px-4 flex items-center justify-end gap-3
                        rounded-xl cursor-pointer text-white transition-all ${
                          isActive
                            ? "bg-(--primeColor)"
                            : "bg-(--primeColor) opacity-75 hover:bg-(--primeColor)/100"
                        }`}
                      >
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                        <item.icon size={18} className="shrink-0" />
                      </Button>
                    )}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            {/* Footer */}
            <footer className="p-4 border-t-2 border-(--borderColor) bg-(--backgroundColor)">
              <div className="flex flex-col items-center gap-1">
                <span className="text-(--textMuted) text-xs">المطور</span>
                <span className="text-(--textColor) text-sm font-bold">
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
