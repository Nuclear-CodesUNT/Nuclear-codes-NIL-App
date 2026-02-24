"use client";

import React, { useEffect, useState } from "react";

type Video = {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  status?: string;
};

function formatDuration(seconds?: number) {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60).toString().padStart(1, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function VideoPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

  async function fetchVideos() {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/videos`, { credentials: "include" });
      if (!res.ok) throw new Error(`Failed to fetch videos (${res.status})`);
      const data = await res.json();
      setVideos(data.videos || []);
    } catch (err: any) {
      // network errors (e.g. backend not running) surface as TypeError in browsers
      console.error("Error fetching videos:", err);
      setError(err?.message ?? "Unknown error while fetching videos");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVideos();
    const id = setInterval(fetchVideos, 8000);
    return () => clearInterval(id);
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading videos…</p>;

  return (
    <div style={{ padding: 20, maxWidth: 1100, margin: "0 auto" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
        <h1 style={{ margin: 0 }}>NIL Education Center</h1>
        <p style={{ margin: 0, color: "#666" }}>Learn the essentials to maximize your NIL opportunities</p>
      </header>

      {error ? (
        <div style={{ marginBottom: 12, color: "#7a1f1f", background: "#fff3f3", padding: 12, borderRadius: 6 }}>
          <strong>Unable to reach server:</strong> {error}
        </div>
      ) : null}

      {videos.length === 0 ? (
        <div
          style={{
            border: "1px solid #eee",
            borderRadius: 10,
            padding: 28,
            background: "#fff",
            textAlign: "center",
            color: "#777",
          }}
        >
          <h2 style={{ marginTop: 0 }}>No Video Uploaded</h2>
          <p style={{ marginTop: 4 }}>
            There are currently no videos available. Upload a video via the backend to see it appear here.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 18 }}>
          {videos.map((v: Video) => (
            <article
              key={v._id}
              style={{
                display: "flex",
                gap: 16,
                alignItems: "flex-start",
                padding: 16,
                border: "1px solid #eee",
                borderRadius: 10,
                background: "#fff",
              }}
            >
              <div style={{ width: 180, minWidth: 140, position: "relative" }}>
                <img
                  src={v.thumbnailUrl || "/images/logo/placeholder.jpg"}
                  alt={v.title}
                  style={{ width: "100%", height: 100, objectFit: "cover", borderRadius: 6 }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: 8,
                    bottom: 8,
                    background: "rgba(0,0,0,0.6)",
                    color: "#fff",
                    padding: "4px 8px",
                    borderRadius: 20,
                    fontSize: 12,
                  }}
                >
                  {v.status ?? "Draft"}
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 style={{ margin: "0 0 6px 0" }}>{v.title}</h3>
                    {v.description && <p style={{ margin: 0, color: "#555" }}>{v.description}</p>}
                  </div>
                  <div style={{ color: "#999", fontSize: 13 }}>{formatDuration(v.durationSeconds)}</div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <video src={v.videoUrl} controls style={{ width: "100%", maxHeight: 360, borderRadius: 8 }} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}