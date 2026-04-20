import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase";
import type { User } from "@supabase/supabase-js";

export type AppRole =
  | "super_admin"
  | "orphans_admin"
  | "sponsors_admin"
  | "user";

interface AuthState {
  user: User | null;
  role: AppRole | null;
  loading: boolean;
}

// ── Shared context so every component reads the same auth state ──
const AuthContext = createContext<AuthState>({
  user: null,
  role: null,
  loading: true,
});

/** Wrap the app with this provider (once, at the root). */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = supabase();
    let mounted = true;
    let currentUid: string | null = null; // staleness tracker

    function handleAuthChange(authUser: User | null) {
      if (!mounted) return;
      const uid = authUser?.id ?? null;
      currentUid = uid;

      if (!authUser) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }

      // Set user immediately so downstream sees authenticated state
      setUser(authUser);

      // Fetch role in background
      (async () => {
        try {
          const { data: profile, error } = await client
            .from("profiles")
            .select("role")
            .eq("id", authUser.id)
            .single();
          if (!mounted || currentUid !== uid) return;
          if (error) {
            setRole("user");
          } else {
            setRole((profile?.role as AppRole) || "user");
          }
        } catch {
          if (mounted && currentUid === uid) setRole("user");
        } finally {
          if (mounted && currentUid === uid) setLoading(false);
        }
      })();
    }

    // onAuthStateChange fires INITIAL_SESSION synchronously, then
    // SIGNED_IN / SIGNED_OUT / TOKEN_REFRESHED as things change.
    // Callback is NOT async — user state is set synchronously.
    const { data: listener } = client.auth.onAuthStateChange(
      (_event, session) => {
        handleAuthChange(session?.user ?? null);
      },
    );

    // Safety timeout — if nothing fires within 10 s, stop the spinner
    const timeout = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 10000);

    return () => {
      mounted = false;
      clearTimeout(timeout);
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Read the shared auth state from anywhere in the tree. */
export function useAuthUser(): AuthState {
  return useContext(AuthContext);
}

export function canAccess(role: AppRole | null, tab: string): boolean {
  if (!role) return false;
  if (role === "super_admin") return true;
  switch (tab) {
    case "overview":
      return true;
    case "orphans":
      return role === "orphans_admin";
    case "sponsors":
      return role === "sponsors_admin";
    case "payments":
      return role === "sponsors_admin";
    case "sponsorships":
      return false;
    case "settings":
      return false;
    case "users":
      return false;
    default:
      return false;
  }
}

export function canEdit(role: AppRole | null, tab: string): boolean {
  if (!role) return false;
  if (role === "super_admin") return true;
  switch (tab) {
    case "orphans":
      return role === "orphans_admin";
    case "sponsors":
      return role === "sponsors_admin";
    case "payments":
      return role === "sponsors_admin";
    default:
      return false;
  }
}
