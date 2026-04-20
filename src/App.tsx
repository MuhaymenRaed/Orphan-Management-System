import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuthUser, canAccess } from "../utils/Supabase/Auth/useAuthUser";
import LoadingSpinner from "../components/LoadingSpinner";
import { useRealtimeSync } from "../utils/Supabase/useRealtimeSync";
import { useGlobalSettings } from "../utils/Supabase/useGlobalSettings";

import Orphans from "../pages/Orphans";
import Sponsors from "../pages/Sponsors";
import Overview from "../pages/Overview";
import Settings from "../pages/Settings";
import SponserShips from "../pages/SponserShips";
import SponsorPayments from "../pages/Salaries";
import SignIn from "../pages/SignIn";
import SignUp from "../pages/SignUp";
import Users from "../pages/Users";
import OrphanReceives from "../pages/OrphanReceives";
import OrphanageFunds from "../pages/OrphanageFunds";
import Header from "../ui/Header";
import Navbar from "../ui/Navbar";
import { useState } from "react";
import { GlobalToaster } from "../utils/toast";
import ResetPassword from "../pages/ResetPassword";
import VerifyEmail from "../pages/VerifyEmail";

function ProtectedRoute({
  children,
  tab,
}: {
  children: React.ReactNode;
  tab: string;
}) {
  const { user, role, loading } = useAuthUser();

  // Still loading auth state, or role hasn't resolved yet
  if (loading || (user && !role)) return <LoadingSpinner />;
  if (!user) return <Navigate to="/signin" replace />;
  if (!canAccess(role, tab))
    return (
      <div
        dir="rtl"
        className="flex flex-col items-center justify-center min-h-[60vh] gap-4 page-enter"
      >
        <div className="w-16 h-16 rounded-2xl bg-[var(--errorColor)]/10 flex items-center justify-center">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--errorColor)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-[var(--textColor)]">
          غير مصرح بالوصول
        </h2>
        <p className="text-[var(--textMuted2)]">
          ليس لديك صلاحية للوصول إلى هذه الصفحة
        </p>
      </div>
    );

  return <>{children}</>;
}

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loading } = useAuthUser();
  const location = useLocation();
  const isAuthPage = [
    "/signin",
    "/signup",
    "/reset-password",
    "/verify-email",
  ].includes(location.pathname);

  // Enable realtime sync for all authenticated users
  useRealtimeSync();

  // Apply saved settings (theme, font size) globally on startup
  useGlobalSettings();

  if (loading) return <LoadingSpinner />;

  // Auth pages: no header/navbar
  if (isAuthPage) {
    return (
      <>
        <GlobalToaster />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
        </Routes>
      </>
    );
  }

  // Not authenticated: redirect to signin
  if (!user) {
    return (
      <>
        <GlobalToaster />
        <Routes>
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </>
    );
  }

  return (
    <>
      <GlobalToaster />
      <Header isOpen={isOpen} setIsOpen={setIsOpen} />
      <main className="page-enter">
        <Routes>
          <Route path="/" element={<Navigate to="/overview" replace />} />
          <Route
            path="/overview"
            element={
              <ProtectedRoute tab="overview">
                <Overview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orphans"
            element={
              <ProtectedRoute tab="orphans">
                <Orphans />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sponsors"
            element={
              <ProtectedRoute tab="sponsors">
                <Sponsors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sponsorships"
            element={
              <ProtectedRoute tab="sponsorships">
                <SponserShips />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sponsor-payments"
            element={
              <ProtectedRoute tab="payments">
                <SponsorPayments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orphan-receives"
            element={
              <ProtectedRoute tab="overview">
                <OrphanReceives />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orphanage-funds"
            element={
              <ProtectedRoute tab="settings">
                <OrphanageFunds />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute tab="settings">
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute tab="users">
                <Users />
              </ProtectedRoute>
            }
          />
          <Route path="/signin" element={<Navigate to="/overview" replace />} />
          <Route path="/signup" element={<Navigate to="/overview" replace />} />
          <Route path="*" element={<Navigate to="/overview" replace />} />
        </Routes>
      </main>
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
}

export default App;
