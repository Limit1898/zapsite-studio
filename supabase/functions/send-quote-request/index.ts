import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.95.0/cors";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.95.0";
import { z } from "https://esm.sh/zod@3.23.8";

const BodySchema = z.object({
  full_name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(5).max(40),
  website_type: z.string().trim().min(1).max(100),
  budget_range: z.string().trim().min(1).max(100),
  project_description: z.string().trim().min(10).max(2000),
});

// NOTE: Until a domain is verified at resend.com/domains, Resend only allows
// sending to the account owner's email (tahajuju7@gmail.com). Once a domain
// is verified, change TO_EMAIL back to "zap.site.studio@gmail.com" and update
// FROM_EMAIL to use that verified domain.
const TO_EMAIL = "zap.site.studio@gmail.com";
const FROM_EMAIL = "Zap Site Studio <onboarding@resend.dev>";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    console.log("[send-quote-request] env check", {
      hasSupabaseUrl: !!SUPABASE_URL,
      hasServiceRole: !!SERVICE_ROLE,
      hasResendKey: !!RESEND_API_KEY,
    });

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "Email service not configured (missing RESEND_API_KEY)" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!SUPABASE_URL || !SERVICE_ROLE) {
      return new Response(JSON.stringify({ error: "Database not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      console.error("[send-quote-request] validation failed:", parsed.error.flatten().fieldErrors);
      return new Response(
        JSON.stringify({ error: "Invalid input" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const data = parsed.data;

    // Save to DB
    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { error: dbError } = await supabase.from("quote_requests").insert(data);
    if (dbError) {
      console.error("[send-quote-request] DB insert error:", dbError);
      return new Response(JSON.stringify({ error: "Failed to save submission" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    console.log("[send-quote-request] DB insert OK");

    // Send email via Resend (direct API)
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background:#0a0f1e; color:#e6f1ff; border-radius:12px;">
        <h2 style="color:#00d4ff; border-bottom:2px solid #f0b429; padding-bottom:10px;">⚡ New Quote Request — Zap Site Studio</h2>
        <table style="width:100%; border-collapse:collapse; margin-top:16px;">
          <tr><td style="padding:8px; color:#f0b429; font-weight:bold; width:160px;">Full Name</td><td style="padding:8px;">${escapeHtml(data.full_name)}</td></tr>
          <tr><td style="padding:8px; color:#f0b429; font-weight:bold;">Email</td><td style="padding:8px;"><a href="mailto:${escapeHtml(data.email)}" style="color:#00d4ff;">${escapeHtml(data.email)}</a></td></tr>
          <tr><td style="padding:8px; color:#f0b429; font-weight:bold;">Phone</td><td style="padding:8px;">${escapeHtml(data.phone)}</td></tr>
          <tr><td style="padding:8px; color:#f0b429; font-weight:bold;">Website Type</td><td style="padding:8px;">${escapeHtml(data.website_type)}</td></tr>
          <tr><td style="padding:8px; color:#f0b429; font-weight:bold;">Budget Range</td><td style="padding:8px;">${escapeHtml(data.budget_range)}</td></tr>
        </table>
        <div style="margin-top:20px; padding:16px; background:rgba(0,212,255,0.08); border-left:4px solid #00d4ff; border-radius:6px;">
          <div style="color:#f0b429; font-weight:bold; margin-bottom:8px;">Project Description</div>
          <div style="white-space:pre-wrap; line-height:1.5;">${escapeHtml(data.project_description)}</div>
        </div>
        <p style="margin-top:24px; color:#7a869a; font-size:12px;">Sent from zapsitestudio.com contact form</p>
      </div>
    `;

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: data.email,
        subject: "⚡ New Quote Request — Zap Site Studio",
        html,
      }),
    });

    const emailBody = await emailRes.text();
    if (!emailRes.ok) {
      console.error("[send-quote-request] Resend error:", emailRes.status, emailBody);
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    console.log("[send-quote-request] Email sent OK:", emailBody);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("[send-quote-request] Unhandled error:", e);
    return new Response(JSON.stringify({ error: "Internal server error", details: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
