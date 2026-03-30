import { Book } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import Button from "../components/Button";
import { motion } from "framer-motion";
import { LogIn, LogOut, User2 } from "lucide-react";
import "../src/index.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuthUser } from "../utils/Supabase/Auth/useAuthUser";
import { signOut } from "../utils/Supabase/Auth/singout";
import { useState } from "react";

export default function Header({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const { user, loading } = useAuthUser();
  const [signingOut, setSigningOut] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      navigate("/signin");
    } catch (e) {
      // handle error, maybe toast
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-(--fillColor) w-full">
      <div className="flex flex-row-reverse items-center justify-between border-b px-4 md:px-8 py-2 border-(--borderColor)">
        <div className="flex items-center gap-2 md:gap-4 sm:gap-6 flex-row-reverse">
          <Button
            adj="rounded-lg text-(--primeColor) transition-all duration-300 ease-out hover:bg-(--primeColor)/10 hover:scale-105 active:scale-95 hover:shadow-sm hover:shadow-(--primeColor)/60"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Book
              className="w-5 rounded h-5 md:w-7 md:h-7 m-2 text-(--primeColor)"
              color="currentColor"
            />
          </Button>
          <p className="text-xg md:text-xl font-medium text-(--cellTextColor) text-right">
            <strong>نظام إدارة الأيتام</strong>
          </p>
          <div className="flex items-center gap-4 px-5 flex-row-reverse">
            {!loading && !user && (
              <Link to="/signin">
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  whileHover={{ scale: 1.04 }}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-(--primeColor) text-white font-bold shadow-md hover:bg-(--primeColor)/90 transition-all duration-300"
                  style={{ minWidth: 0 }}
                >
                  <LogIn className="w-5 h-5" />
                  <span className="hidden xs:inline">تسجيل الدخول</span>
                </motion.button>
              </Link>
            )}
            {!loading && user && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 px-2 py-1 rounded-full bg-white/80 border border-(--primeColor) shadow-sm"
              >
                <User2 className="w-5 h-5 text-(--primeColor)" />
                <span className="text-(--primeColor) font-bold max-w-[90px] truncate">
                  {user.email?.split("@")[0] || "المستخدم"}
                </span>
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  whileHover={{ scale: 1.04 }}
                  className="flex items-center gap-1 px-2 py-1 rounded-full bg-red-500 text-white font-bold ml-1 shadow hover:bg-red-600 transition-all duration-300"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  style={{ minWidth: 0 }}
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden xs:inline">
                    {signingOut ? "..." : "خروج"}
                  </span>
                </motion.button>
              </motion.div>
            )}
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
