import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "./supabase";

/**
 * Subscribe to Supabase realtime changes on key tables and
 * auto-invalidate the corresponding React Query caches.
 */
export function useRealtimeSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const client = supabase();

    const channel = client
      .channel("realtime-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sponsorship" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["sponsorships"] });
          queryClient.invalidateQueries({ queryKey: ["sponsors"] });
          queryClient.invalidateQueries({ queryKey: ["sponsorStats"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sponsor" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["sponsors"] });
          queryClient.invalidateQueries({ queryKey: ["sponsorStats"] });
          queryClient.invalidateQueries({ queryKey: ["sponsorships"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orphan" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["orphans"] });
          queryClient.invalidateQueries({ queryKey: ["orphans", "lookup"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orphanage_funds" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["orphanageFunds"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "sponsor_payment" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["sponsorPayments"] });
        },
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [queryClient]);
}
