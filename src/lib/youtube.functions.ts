import { createServerFn } from "@tanstack/react-start";

const CHANNEL_ID = "UCQdEUCSB88IoTQrRuQJ3POA"; // Fan The Spark

export const getLatestVideos = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`,
      { headers: { "User-Agent": "Mozilla/5.0" } },
    );
    if (!res.ok) return [] as string[];
    const xml = await res.text();
    const ids = Array.from(xml.matchAll(/<yt:videoId>([^<]+)<\/yt:videoId>/g)).map(
      (m) => m[1],
    );
    return ids.slice(0, 4);
  } catch (e) {
    console.error("getLatestVideos error", e);
    return [] as string[];
  }
});
