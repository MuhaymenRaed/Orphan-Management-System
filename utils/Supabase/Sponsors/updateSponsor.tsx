import { supabase } from "../supabase";
import { generateSponsorPayment } from "../SponsorPayments/generatePayments";

/**
 * Update a sponsor's info and sync orphan assignments.
 *
 * New architecture: sponsor table = source of truth for active sponsorships.
 * Each row = one sponsor–orphan link (replicated sponsor data per orphan).
 * sponsorship table = historical log only.
 */
export async function updateSponsorFull(payload: {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  sponsorship_type?: string;
  status?: string;
  orphanIds: string[];
}) {
  const { id, orphanIds, ...updateFields } = payload;
  const client = supabase();

  // 1. Get this sponsor's identity to find all sibling rows
  const { data: thisSponsor, error: sErr } = await client
    .from("sponsor")
    .select("name, phone, sponsorship_type, join_date")
    .eq("id", id)
    .single();

  if (sErr) throw sErr;

  // 2. Find all sibling rows (same person)
  const { data: siblings, error: sibErr } = await client
    .from("sponsor")
    .select("id, orphan_id, created_at")
    .eq("name", thisSponsor.name)
    .eq("phone", thisSponsor.phone)
    .eq("is_deleted", false);

  if (sibErr) throw sibErr;

  const siblingIds = (siblings || []).map((s: any) => s.id);
  const currentOrphanIds = (siblings || [])
    .map((s: any) => s.orphan_id)
    .filter(Boolean) as string[];

  // 3. Determine added/removed orphans
  const addedOrphanIds = orphanIds.filter(
    (oid) => !currentOrphanIds.includes(oid),
  );
  const removedOrphanIds = currentOrphanIds.filter(
    (oid) => !orphanIds.includes(oid),
  );

  // 4. Update common fields on ALL sibling rows
  if (siblingIds.length > 0) {
    const { error: uErr } = await client
      .from("sponsor")
      .update(updateFields)
      .in("id", siblingIds);
    if (uErr) throw uErr;
  }

  // 5. Remove rows for removed orphans (soft-delete) + log to sponsorship history
  for (const orphanId of removedOrphanIds) {
    const removedRow = (siblings || []).find(
      (s: any) => s.orphan_id === orphanId,
    );
    if (removedRow) {
      // Soft-delete the sponsor row
      await client
        .from("sponsor")
        .update({ is_deleted: true })
        .eq("id", removedRow.id);

      // Log to sponsorship table as historical record
      const { error: histErr } = await client.from("sponsorship").insert({
        sponsor_id: removedRow.id,
        orphan_id: orphanId,
        sponsorship_type:
          updateFields.sponsorship_type ||
          thisSponsor.sponsorship_type ||
          "كفالة جزئية",
        start_date: removedRow.created_at
          ? removedRow.created_at.split("T")[0]
          : thisSponsor.join_date,
        status: "متوقف",
      });
      if (histErr) throw histErr;
    }
  }

  // 6. Insert new rows for added orphans
  if (addedOrphanIds.length > 0) {
    const baseData = {
      name: updateFields.name || thisSponsor.name,
      phone: updateFields.phone || thisSponsor.phone,
      email: updateFields.email,
      sponsorship_type:
        updateFields.sponsorship_type || thisSponsor.sponsorship_type,
      status: updateFields.status || "نشط",
      join_date:
        thisSponsor.join_date || new Date().toISOString().split("T")[0],
      is_deleted: false,
    };

    const rows = addedOrphanIds.map((orphanId) => ({
      ...baseData,
      orphan_id: orphanId,
    }));

    const { error: insErr } = await client.from("sponsor").insert(rows);
    if (insErr) throw insErr;
  }

  // 7. Handle case: if all orphans removed but sponsor should still exist (no orphans)
  // If orphanIds is empty and we removed all, keep one row with orphan_id = null
  if (orphanIds.length === 0 && currentOrphanIds.length > 0) {
    // All orphans removed — at least one sibling was soft-deleted above.
    // Insert a clean row with no orphan.
    const baseData = {
      name: updateFields.name || thisSponsor.name,
      phone: updateFields.phone || thisSponsor.phone,
      email: updateFields.email,
      sponsorship_type:
        updateFields.sponsorship_type || thisSponsor.sponsorship_type,
      status: updateFields.status || "نشط",
      join_date:
        thisSponsor.join_date || new Date().toISOString().split("T")[0],
      is_deleted: false,
      orphan_id: null,
    };
    await client.from("sponsor").insert(baseData);
  }

  // 8. Update orphan is_sponsored flags
  for (const orphanId of addedOrphanIds) {
    await client
      .from("orphan")
      .update({ is_sponsored: true })
      .eq("id", orphanId);
  }
  for (const orphanId of removedOrphanIds) {
    // Check if this orphan still has any other active sponsor
    const { data: remaining } = await client
      .from("sponsor")
      .select("id")
      .eq("orphan_id", orphanId)
      .eq("is_deleted", false)
      .limit(1);

    if (!remaining || remaining.length === 0) {
      await client
        .from("orphan")
        .update({ is_sponsored: false })
        .eq("id", orphanId);
    }
  }

  // 9. Recalculate sponsor_payment for current month
  const finalName = updateFields.name || thisSponsor.name;
  const finalPhone = updateFields.phone || thisSponsor.phone;
  await generateSponsorPayment(finalName, finalPhone);

  return { success: true };
}

/** Sync sponsor_payment status when sponsor status changes */
export async function syncSponsorPaymentStatus(
  sponsorId: string,
  newStatus: string,
) {
  const client = supabase();

  if (newStatus === "متوقف") {
    const { error } = await client
      .from("sponsor_payment")
      .update({ status: "متوقف" })
      .eq("sponsor_id", sponsorId);
    if (error) throw error;
  } else if (newStatus === "نشط") {
    const { error } = await client
      .from("sponsor_payment")
      .update({ status: "قيد الانتظار" })
      .eq("sponsor_id", sponsorId)
      .eq("status", "متوقف");
    if (error) throw error;
  }
}
