"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

type Video = {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  status?: string;
};

function parseSignedUrlExpiryMs(url: string): number | null {
  try {
    const parsed = new URL(url);
    const signedAt = parsed.searchParams.get("X-Amz-Date");
    const expiresSeconds = parsed.searchParams.get("X-Amz-Expires");

    if (!signedAt || !expiresSeconds) return null;
    if (!/^\d{8}T\d{6}Z$/.test(signedAt)) return null;

    const year = Number(signedAt.slice(0, 4));
    const month = Number(signedAt.slice(4, 6)) - 1;
    const day = Number(signedAt.slice(6, 8));
    const hour = Number(signedAt.slice(9, 11));
    const minute = Number(signedAt.slice(11, 13));
    const second = Number(signedAt.slice(13, 15));

    const issuedMs = Date.UTC(year, month, day, hour, minute, second);
    const ttlMs = Number(expiresSeconds) * 1000;
    if (!Number.isFinite(issuedMs) || !Number.isFinite(ttlMs)) return null;

    return issuedMs + ttlMs;
  } catch {
    return null;
  }
}

function mergeVideosKeepingActiveUrls(previous: Video[], incoming: Video[]): Video[] {
  const previousById = new Map(previous.map((video) => [video._id, video]));
  const now = Date.now();

  return incoming.map((nextVideo) => {
    const prevVideo = previousById.get(nextVideo._id);
    if (!prevVideo?.videoUrl) return nextVideo;

    const expiryMs = parseSignedUrlExpiryMs(prevVideo.videoUrl);
    const stillValid = expiryMs === null || expiryMs - now > 60_000;

    if (!stillValid) return nextVideo;
    return { ...nextVideo, videoUrl: prevVideo.videoUrl };
  });
}

function videosEqual(left: Video[], right: Video[]) {
  if (left.length !== right.length) return false;

  for (let index = 0; index < left.length; index += 1) {
    const leftVideo = left[index];
    const rightVideo = right[index];

    if (
      leftVideo._id !== rightVideo._id ||
      leftVideo.title !== rightVideo.title ||
      leftVideo.description !== rightVideo.description ||
      leftVideo.videoUrl !== rightVideo.videoUrl ||
      leftVideo.thumbnailUrl !== rightVideo.thumbnailUrl ||
      leftVideo.durationSeconds !== rightVideo.durationSeconds ||
      leftVideo.status !== rightVideo.status
    ) {
      return false;
    }
  }

  return true;
}

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
  const [isAnyVideoPlaying, setIsAnyVideoPlaying] = useState(false);
  const playingVideoIdsRef = useRef<Set<string>>(new Set());

  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

  const fetchVideos = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/videos`, { credentials: "include" });
      if (!res.ok) throw new Error(`Failed to fetch videos (${res.status})`);
      const data = await res.json();
      const incoming = (data.videos || []) as Video[];
      setVideos((previous) => {
        const merged = mergeVideosKeepingActiveUrls(previous, incoming);
        return videosEqual(previous, merged) ? previous : merged;
      });
    } catch (err: unknown) {
      // network errors (e.g. backend not running) surface as TypeError in browsers
      console.error("Error fetching videos:", err);
      const message = err instanceof Error ? err.message : "Unknown error while fetching videos";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [API_BASE]);

  const markVideoPlaying = useCallback((videoId: string) => {
    playingVideoIdsRef.current.add(videoId);
    setIsAnyVideoPlaying(true);
  }, []);

  const markVideoNotPlaying = useCallback((videoId: string) => {
    playingVideoIdsRef.current.delete(videoId);
    setIsAnyVideoPlaying(playingVideoIdsRef.current.size > 0);
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  useEffect(() => {
    if (isAnyVideoPlaying) return;
    const id = setInterval(fetchVideos, 8000);
    return () => clearInterval(id);
  }, [fetchVideos, isAnyVideoPlaying]);

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
                  <video
                    src={v.videoUrl}
                    controls
                    onPlay={() => markVideoPlaying(v._id)}
                    onPause={() => markVideoNotPlaying(v._id)}
                    onEnded={() => markVideoNotPlaying(v._id)}
                    style={{ width: "100%", maxHeight: 360, borderRadius: 8 }}
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}