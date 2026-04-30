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

const TO_EMAIL = "zap.site.studio@gmail.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const json = await req.json();
    const parsed = BodySchema.safeParse(json);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: "Invalid input", details: parsed.error.flatten().fieldErrors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    const data = parsed.data;

    // Save to DB
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );
    const { error: dbError } = await supabase.from("quote_requests").insert(data);
    if (dbError) {
      console.error("DB insert error:", dbError);
      return new Response(JSON.stringify({ error: "Failed to save submission" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Send email via Resend
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!RESEND_API_KEY || !LOVABLE_API_KEY) {
      console.error("Missing API keys");
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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

    const emailRes = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "X-Connection-Api-Key": RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: "Zap Site Studio <onboarding@resend.dev>",
        to: [TO_EMAIL],
        reply_to: data.email,
        subject: "⚡ New Quote Request — Zap Site Studio",
        html,
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error("Resend error:", emailRes.status, errText);
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Unhandled error:", e);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
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
