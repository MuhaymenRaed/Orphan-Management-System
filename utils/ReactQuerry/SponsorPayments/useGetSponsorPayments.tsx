import { useQuery } from "@tanstack/react-query";
import { fetchSponsorPayments } from "../../Supabase/SponsorPayments/fetchSponsorPayments";

export function useGetSponsorPayments() {
  return useQuery({
    queryKey: ["sponsorPayments"],
    queryFn: fetchSponsorPayments,
  });
}
