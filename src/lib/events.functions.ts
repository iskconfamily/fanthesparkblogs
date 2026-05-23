import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type EventRow = {
  id: string;
  title: string;
  image_url: string | null;
  start_date: string; // YYYY-MM-DD
  end_date: string;
  location: string;
  short_note: string | null;
  status: "draft" | "published";
  display_order: number | null;
};

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

// All published events, partitioned into upcoming/past.
export const getPublishedEvents = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin
    .from("events")
    .select("id, title, image_url, start_date, end_date, location, short_note, status, display_order")
    .eq("status", "published")
    .order("start_date", { ascending: true });
  if (error) {
    console.error("getPublishedEvents error:", error);
    return { upcoming: [] as EventRow[], past: [] as EventRow[] };
  }
  const today = todayISO();
  const rows = (data ?? []) as EventRow[];
  const upcoming = rows
    .filter((e) => e.end_date >= today)
    .sort((a, b) => {
      const ao = a.display_order ?? 9999;
      const bo = b.display_order ?? 9999;
      if (ao !== bo) return ao - bo;
      return a.start_date.localeCompare(b.start_date);
    });
  const past = rows
    .filter((e) => e.end_date < today)
    .sort((a, b) => b.start_date.localeCompare(a.start_date));
  return { upcoming, past };
});

// Limited list of upcoming events (for homepage).
export const getUpcomingEvents = createServerFn({ method: "GET" })
  .inputValidator((input) => z.object({ limit: z.number().int().min(1).max(10).default(3) }).parse(input))
  .handler(async ({ data }) => {
    const today = todayISO();
    const { data: rows, error } = await supabaseAdmin
      .from("events")
      .select("id, title, image_url, start_date, end_date, location, short_note, status, display_order")
      .eq("status", "published")
      .gte("end_date", today)
      .order("display_order", { ascending: true, nullsFirst: false })
      .order("start_date", { ascending: true })
      .limit(data.limit);
    if (error) {
      console.error("getUpcomingEvents error:", error);
      return [] as EventRow[];
    }
    return (rows ?? []) as EventRow[];
  });
