import { Menu } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import { motion } from "framer-motion";
import { LogIn, LogOut, User2, Shield, ChevronDown } from "lucide-react";
import "../src/index.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuthUser, type AppRole } from "../utils/Supabase/Auth/useAuthUser";
import { signOut } from "../utils/Supabase/Auth/singout";
import { useState, useRef, useEffect } from "react";

const roleLabels: Record<AppRole, string> = {
  super_admin: "مدير النظام",
  orphans_admin: "مشرف الأيتام",
  sponsors_admin: "مشرف الكفلاء",
  user: "مستخدم",
};

const roleBadgeColors: Record<AppRole, string> = {
  super_admin: "bg-amber-500/10 text-amber-600 border-amber-500/30",
  orphans_admin: "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
  sponsors_admin: "bg-blue-500/10 text-blue-600 border-blue-500/30",
  user: "bg-gray-500/10 text-gray-600 border-gray-500/30",
};

export default function Header({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const { user, role, loading } = useAuthUser();
  const [signingOut, setSigningOut] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      navigate("/signin");
    } catch {
      // handled silently
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[var(--backgroundColor)]/80 backdrop-blur-xl border-b border-[var(--borderColor)] w-full">
      <div className="flex flex-row-reverse items-center justify-between px-4 md:px-8 py-2.5">
        <div className="flex items-center gap-3 md:gap-4 flex-row-reverse">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-[var(--primeColor)] hover:bg-[var(--primeColor)]/10 transition-all duration-200 active:scale-95"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="hidden sm:block">
            <p className="text-sm md:text-base font-bold text-[var(--textColor)]">
              نظام إدارة الأيتام
            </p>
          </div>

          {/* User Section */}
          <div className="flex items-center gap-3 flex-row-reverse">
            {!loading && !user && (
              <Link to="/signin">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--primeColor)] text-white font-bold text-sm shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <LogIn className="w-4 h-4" />
                  <span className="hidden sm:inline">تسجيل الدخول</span>
                </motion.button>
              </Link>
            )}

            {!loading && user && (
              <div ref={dropdownRef} className="relative">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-[var(--fillColor)] border border-[var(--borderColor)] hover:border-[var(--primeColor)]/40 transition-all duration-200 cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--primeColor)] to-emerald-400 flex items-center justify-center shadow-sm">
                    <User2 className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-xs font-bold text-[var(--textColor)] max-w-[100px] truncate leading-tight">
                      {user.email?.split("@")[0] || "المستخدم"}
                    </span>
                    {role && (
                      <span className="text-[10px] text-[var(--textMuted2)] leading-tight">
                        {roleLabels[role]}
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[var(--textMuted)] transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
                  />
                </motion.button>

                {showDropdown && (
                  <div
                    className="absolute left-0 top-full mt-2 w-56 rounded-xl border border-[var(--borderColor)] bg-[var(--backgroundColor)] shadow-lg p-2 animate-scaleIn z-50"
                    dir="rtl"
                  >
                    <div className="px-3 py-2.5 border-b border-[var(--borderColor)] mb-2">
                      <p className="text-sm font-bold text-[var(--textColor)] truncate">
                        {user.email}
                      </p>
                      {role && (
                        <span
                          className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold border ${roleBadgeColors[role]}`}
                        >
                          <Shield className="w-3 h-3" />
                          {roleLabels[role]}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={handleSignOut}
                      disabled={signingOut}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[var(--errorColor)] hover:bg-[var(--errorColor)]/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>
                        {signingOut ? "جاري الخروج..." : "تسجيل الخروج"}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
