import { createContext, useContext, useEffect, useState, useCallback } from "react";
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

  const fetchRole = useCallback(async (authUser: User | null) => {
    if (!authUser) {
      setUser(null);
      setRole(null);
      setLoading(false);
      return;
    }
    setUser(authUser);
    try {
      const { data: profile, error } = await supabase()
        .from("profiles")
        .select("role")
        .eq("id", authUser.id)
        .single();
      if (error) throw error;
      setRole((profile?.role as AppRole) || "user");
    } catch {
      // Profile may not exist yet (just signed up) — default to user
      setRole("user");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const client = supabase();
    let mounted = true;

    // Initial session check via getSession (fast, uses local cache)
    const init = async () => {
      try {
        const { data: { session } } = await client.auth.getSession();
        if (mounted) {
          await fetchRole(session?.user ?? null);
        }
      } catch {
        if (mounted) {
          setUser(null);
          setRole(null);
          setLoading(false);
        }
      }
    };

    init();

    // Safety timeout — if auth takes more than 5 seconds, stop loading
    const timeout = setTimeout(() => {
      if (mounted && loading) {
        setLoading(false);
      }
    }, 5000);

    // Listen for auth changes (sign-in, sign-out, token refresh)
    const { data: listener } = client.auth.onAuthStateChange(
      async (_event, session) => {
        if (mounted) {
          await fetchRole(session?.user ?? null);
        }
      },
    );

    return () => {
      mounted = false;
      clearTimeout(timeout);
      listener.subscription.unsubscribe();
    };
  }, [fetchRole]);

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
    case "salaries":
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
    case "salaries":
      return role === "orphans_admin";
    case "sponsors":
      return role === "sponsors_admin";
    case "payments":
      return role === "sponsors_admin";
    default:
      return false;
  }
}
