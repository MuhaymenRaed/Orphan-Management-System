// utils/sponsor.ts

/* ===== Form data (Modal / UI) ===== */
export type SponsorFormData = {
  orphanIds: string[];
  fullName: string;
  phone: string;
  email?: string;
  sponsorshipType?: string;
  status: string;
};

/* ===== DB-ready payload for sponsor table ===== */
export type SponsorPayload = {
  orphan_id?: string | null;
  name: string;
  phone: string;
  email?: string | null;
  sponsorship_type?: string;
  status?: string;
};

/* ===== Update payload ===== */
export type UpdateSponsorPayload = SponsorPayload & {
  id: string;
};
