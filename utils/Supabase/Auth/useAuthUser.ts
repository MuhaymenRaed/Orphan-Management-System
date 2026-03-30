import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import type { User } from "@supabase/supabase-js";

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const client = supabase();
    const getUser = async () => {
      const { data } = await client.auth.getUser();
      setUser(data.user);
      setLoading(false);
    };
    getUser();
    const { data: listener } = client.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      },
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
