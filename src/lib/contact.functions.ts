import { createServerFn } from "@tanstack/react-start";
import { getRequestIP, getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  category: z.string().trim().min(1).max(80),
  message: z.string().trim().min(1).max(1000),
  consent: z.literal(true),
  pagePath: z.string().max(255).optional(),
  formLoadedAt: z.number().int().positive(),
  // honeypot — must be empty
  website: z.string().max(0).optional().default(""),
});

const MIN_FILL_MS = 2000;
const THROTTLE_WINDOW_MS = 10 * 60 * 1000;
const THROTTLE_MAX = 3;

export const submitContact = createServerFn({ method: "POST" })
  .inputValidator((input) => contactSchema.parse(input))
  .handler(async ({ data }) => {
    // Honeypot — pretend success, do nothing.
    if (data.website && data.website.length > 0) {
      return { ok: true as const };
    }

    // Time-trap — too fast = bot. Pretend success.
    const elapsed = Date.now() - data.formLoadedAt;
    if (elapsed < MIN_FILL_MS) {
      return { ok: true as const };
    }

    // Per-IP throttle
    let ip: string | null = null;
    try {
      ip = getRequestIP({ xForwardedFor: true }) ?? null;
    } catch {
      ip = null;
    }
    let userAgent: string | null = null;
    try {
      userAgent = getRequestHeader("user-agent") ?? null;
    } catch {
      userAgent = null;
    }

    if (ip) {
      const since = new Date(Date.now() - THROTTLE_WINDOW_MS).toISOString();
      const { count, error: countError } = await supabaseAdmin
        .from("contact_submissions")
        .select("id", { count: "exact", head: true })
        .eq("ip_address", ip)
        .gte("created_at", since);

      if (countError) {
        console.error("contact throttle check failed", countError);
      } else if ((count ?? 0) >= THROTTLE_MAX) {
        return {
          ok: false as const,
          error: "Too many submissions. Please try again in a few minutes.",
        };
      }
    }

    const { error } = await supabaseAdmin.from("contact_submissions").insert({
      name: data.name,
      email: data.email,
      category: data.category,
      message: data.message,
      consent: data.consent,
      page_path: data.pagePath ?? null,
      ip_address: ip,
      user_agent: userAgent,
    });

    if (error) {
      console.error("contact insert failed", error);
      return { ok: false as const, error: "Could not send message. Please try again." };
    }

    return { ok: true as const };
  });
