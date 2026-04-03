import { supabase } from "./supabase";

/**
 * Send a notification email via the Supabase Edge Function "send-email".
 *
 * Deploy the following Edge Function in your Supabase project:
 *
 *   supabase functions new send-email
 *
 * Then paste this into supabase/functions/send-email/index.ts:
 *
 * ```ts
 * import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
 *
 * const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
 *
 * serve(async (req) => {
 *   const { to, subject, html } = await req.json();
 *   const res = await fetch("https://api.resend.com/emails", {
 *     method: "POST",
 *     headers: {
 *       "Content-Type": "application/json",
 *       Authorization: `Bearer ${RESEND_API_KEY}`,
 *     },
 *     body: JSON.stringify({ from: "نظام الأيتام <noreply@yourdomain.com>", to, subject, html }),
 *   });
 *   const data = await res.json();
 *   return new Response(JSON.stringify(data), {
 *     headers: { "Content-Type": "application/json" },
 *     status: res.ok ? 200 : 400,
 *   });
 * });
 * ```
 *
 * Set the secret: supabase secrets set RESEND_API_KEY=re_xxxxx
 */
export async function sendNotificationEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) {
  const { data, error } = await supabase().functions.invoke("send-email", {
    body: { to, subject, html: body },
  });
  if (error) throw error;
  return data;
}

/**
 * Send a test notification email to verify the email setup works.
 */
export async function sendTestEmail(to: string) {
  return sendNotificationEmail({
    to,
    subject: "اختبار إشعارات نظام إدارة الأيتام",
    body: `
      <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #3b7e5c; margin-bottom: 16px;">✅ تم إرسال الإشعار بنجاح</h2>
        <p style="color: #374151; line-height: 1.8;">
          هذه رسالة اختبارية من <strong>نظام إدارة الأيتام</strong> للتأكد من أن إشعارات البريد الإلكتروني تعمل بشكل صحيح.
        </p>
        <p style="color: #6b7280; font-size: 13px; margin-top: 24px;">
          تم الإرسال في ${new Date().toLocaleString("ar-EG")}
        </p>
      </div>
    `,
  });
}

/**
 * Notify admin about a new sponsorship.
 */
export async function notifyNewSponsorship(
  adminEmail: string,
  sponsorName: string,
  orphanName: string,
) {
  return sendNotificationEmail({
    to: adminEmail,
    subject: `كفالة جديدة: ${sponsorName} → ${orphanName}`,
    body: `
      <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #3b7e5c;">🤝 كفالة جديدة</h2>
        <p style="color: #374151; line-height: 1.8;">
          تم إنشاء كفالة جديدة بين الكفيل <strong>${sponsorName}</strong> واليتيم <strong>${orphanName}</strong>.
        </p>
        <p style="color: #6b7280; font-size: 13px; margin-top: 24px;">
          نظام إدارة الأيتام - ${new Date().toLocaleString("ar-EG")}
        </p>
      </div>
    `,
  });
}

/**
 * Notify admin about an urgent case.
 */
export async function notifyUrgentCase(
  adminEmail: string,
  orphanName: string,
  priority: number,
) {
  return sendNotificationEmail({
    to: adminEmail,
    subject: `⚠️ حالة عاجلة: ${orphanName} (أولوية ${priority})`,
    body: `
      <div dir="rtl" style="font-family: Arial, sans-serif; padding: 20px; max-width: 500px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px;">
        <h2 style="color: #dc2626;">⚠️ حالة عاجلة</h2>
        <p style="color: #374151; line-height: 1.8;">
          اليتيم <strong>${orphanName}</strong> لديه أولوية <strong>${priority}</strong> ويحتاج اهتماماً عاجلاً.
        </p>
        <p style="color: #6b7280; font-size: 13px; margin-top: 24px;">
          نظام إدارة الأيتام - ${new Date().toLocaleString("ar-EG")}
        </p>
      </div>
    `,
  });
}
