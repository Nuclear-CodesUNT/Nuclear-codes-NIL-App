// frontend/src/app/video/page.tsx
"use client";

/**
 * Mixed version (final for your file path):
 * - Compatible with your existing backend behavior:
 *   - GET `${API_BASE}/api/videos` with credentials
 *   - signed-url merge/refresh protection
 *   - polling pauses while any video is playing
 *   - localStorage completedVideoIds
 * - Uses the recreated page layout (sidebar + module cards) while still using your shadcn components.
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchCompletedVideos, setVideoCompleted } from "@/lib/api";
import Image from "next/image";
import {
  GraduationCap,
  PlayCircle,
  BookOpen,
  LayoutGrid,
  Users,
  ShieldCheck,
  FileText,
  ChevronDown,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";


/* ----------------------------- Types ----------------------------- */

type Video = {
  _id: string;
  title: string;
  description?: string;
  videoUrl: string;
  thumbnailUrl?: string;
  durationSeconds?: number;
  status?: string;
};

const COURSE_PRESETS = [
  {
    title: "Building Your Personal Brand",
    description:
      "Learn how to create and maintain a strong personal brand as a student-athlete in the NIL era.",
  },
  {
    title: "Social Media Marketing for Athletes",
    description:
      "Master the art of social media to grow your following and attract brand partnerships.",
  },
  {
    title: "Understanding NIL Contracts",
    description:
      "Navigate the legal landscape of NIL deals and learn what to look for in contracts.",
  },
  {
    title: "Financial Literacy for Student-Athletes",
    description:
      "Learn how to manage your NIL earnings, taxes, and plan for your financial future.",
  },
] as const;

type CourseModule = {
  id: string;
  title: string;
  description: string;
  videos: Video[];
  completedCount: number;
  progressPercent: number;
  statusLabel: "In Progress" | "Not Started" | "Completed";
};

/* ----------------------------- Backend-compat helpers ----------------------------- */

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
  for (let i = 0; i < left.length; i += 1) {
    const a = left[i];
    const b = right[i];
    if (
      a._id !== b._id ||
      a.title !== b.title ||
      a.description !== b.description ||
      a.videoUrl !== b.videoUrl ||
      a.thumbnailUrl !== b.thumbnailUrl ||
      a.durationSeconds !== b.durationSeconds ||
      a.status !== b.status
    ) {
      return false;
    }
  }
  return true;
}

function formatDuration(seconds?: number) {
  if (!seconds || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60).toString().padStart(1, "0");
  const s = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

function normalizeStatus(status?: string) {
  const raw = (status || "draft").toLowerCase();

  if (raw === "completed") {
    return { label: "Completed", variant: "default" as const };
  }
  if (raw === "published") {
    return { label: "Published", variant: "secondary" as const };
  }
  if (raw === "in-progress" || raw === "in_progress") {
    return { label: "In Progress", variant: "secondary" as const };
  }
  return { label: "Draft", variant: "outline" as const };
}

function isCompletedStatus(status?: string) {
  const raw = (status || "draft").toLowerCase();
  return raw === "completed" || raw === "published";
}

function buildModulesWithLocalCompletion(videos: Video[], completedVideoIds: string[]): CourseModule[] {
  if (videos.length === 0) return [];

  const targetCount = Math.min(COURSE_PRESETS.length, Math.max(1, Math.ceil(videos.length / 3)));
  const chunkSize = Math.ceil(videos.length / targetCount);

  return Array.from({ length: targetCount }).map((_, index) => {
    const preset = COURSE_PRESETS[index];
    const start = index * chunkSize;
    const end = start + chunkSize;
    const items = videos.slice(start, end);

    const completedCount = items.filter((v) => completedVideoIds.includes(v._id)).length;
    const progressPercent = items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0;

    const statusLabel: CourseModule["statusLabel"] =
      progressPercent >= 100 && items.length > 0
        ? "Completed"
        : progressPercent > 0
          ? "In Progress"
          : "Not Started";

    return {
      id: `module-${index + 1}`,
      title: preset.title,
      description: preset.description,
      videos: items,
      completedCount,
      progressPercent,
      statusLabel,
    };
  });
}

/* ----------------------------- Sidebar UI ----------------------------- */

function SidebarItem({
  icon,
  label,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={[
        "mb-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition",
        active ? "bg-teal-500 text-white" : "text-slate-200 hover:bg-slate-800",
      ].join(" ")}
    >
      <span className="inline-flex h-5 w-5 items-center justify-center">{icon}</span>
      {label}
    </button>
  );
}

function Sidebar() {
  return (
    <aside className="hidden w-72 shrink-0 flex-col bg-slate-900 text-white lg:flex">
      <div className="px-6 py-6">
        <div className="text-sm font-semibold text-slate-200">NIL Athlete Law</div>
        <div className="mt-1 text-xs text-slate-400">@jdavis_athlete</div>
      </div>

      <nav className="px-3">
        <SidebarItem active icon={<BookOpen className="h-5 w-5" />} label="Financial Literacy" />
        <SidebarItem icon={<LayoutGrid className="h-5 w-5" />} label="Dashboard" />
        <SidebarItem icon={<Users className="h-5 w-5" />} label="Players" />
        <SidebarItem icon={<ShieldCheck className="h-5 w-5" />} label="Coaches" />
        <SidebarItem icon={<FileText className="h-5 w-5" />} label="Contracts" />
      </nav>

      <div className="mt-auto px-6 py-6 text-xs text-slate-400">© NIL Athlete Law</div>
    </aside>
  );
}

function ModuleStatusPill({ status }: { status: CourseModule["statusLabel"] }) {
  if (status === "Completed") {
    return <Badge className="bg-teal-600 text-white hover:bg-teal-600">Completed</Badge>;
  }
  if (status === "In Progress") {
    return <Badge className="bg-teal-500 text-white hover:bg-teal-500">In Progress</Badge>;
  }
  return (
    <Badge variant="secondary" className="bg-gray-200 text-gray-600 hover:bg-gray-200">
      Not Started
    </Badge>
  );
}

/* ----------------------------- Page ----------------------------- */

export default function Page() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAnyVideoPlaying, setIsAnyVideoPlaying] = useState(false);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const [completedVideoIds, setCompletedVideoIds] = useState<string[]>([]);

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

  const markVideoCompleted = useCallback(
    async (videoId: string) => {
      try {
        await setVideoCompleted(videoId);
        setCompletedVideoIds((ids) => (ids.includes(videoId) ? ids : [...ids, videoId]));
      } catch (err) {
        // Optionally show error to user
      }
      markVideoNotPlaying(videoId);
    },
    [markVideoNotPlaying]
  );

  // Fetch completed videos from backend on mount
  useEffect(() => {
    fetchCompletedVideos()
      .then((ids) => setCompletedVideoIds(ids))
      .catch(() => setCompletedVideoIds([]));
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  // Poll only when no video is playing
  useEffect(() => {
    if (isAnyVideoPlaying) return;
    const id = setInterval(fetchVideos, 8000);
    return () => clearInterval(id);
  }, [fetchVideos, isAnyVideoPlaying]);

  const modules = useMemo(() => buildModulesWithLocalCompletion(videos, completedVideoIds), [videos, completedVideoIds]);

  useEffect(() => {
    if (videos.length === 0) {
      setActiveVideoId(null);
      return;
    }
    setActiveVideoId((prev) => {
      if (prev && videos.some((v) => v._id === prev)) return prev;
      return videos[0]._id;
    });
  }, [videos]);

  const activeVideo = useMemo(() => videos.find((v) => v._id === activeVideoId) ?? null, [videos, activeVideoId]);

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-5xl px-4 py-6 md:px-8 md:py-8">
        <p className="text-sm text-muted-foreground">Loading videos…</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <Sidebar />

        <main className="flex-1">
          <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-10">
            {/* Header */}
            <header className="mb-6 flex items-center gap-4">
              <div className="rounded-2xl bg-teal-100 p-3 text-teal-700">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">NIL Education Center</h1>
                <p className="text-base text-gray-500">
                  Learn the essentials to maximize your NIL opportunities
                </p>
              </div>
            </header>

            {error ? (
              <Card className="mb-5 border-destructive/30 bg-destructive/5">
                <CardContent className="pt-6 text-sm text-destructive">
                  <span className="font-medium">Unable to reach server:</span> {error}
                </CardContent>
              </Card>
            ) : null}

            {videos.length === 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>No Video Uploaded</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  There are currently no videos available. Upload a video from the backend and it will appear here.
                </CardContent>
              </Card>
            ) : (
              <Accordion
                type="multiple"
                defaultValue={modules.length ? [modules[0].id] : []}
                className="space-y-6"
              >
                {modules.map((module) => {
                  const cover = module.videos[0];

                  return (
                    <AccordionItem
                      key={module.id}
                      value={module.id}
                      className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
                    >
                      <AccordionTrigger className="px-6 py-6 hover:no-underline">
                        <div className="flex w-full items-start justify-between gap-4 text-left">
                          <div className="flex min-w-0 items-start gap-5">
                            <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                              <Image
                                src={cover?.thumbnailUrl || "/images/court.png"}
                                alt={module.title}
                                fill
                                sizes="96px"
                                className="object-cover"
                              />
                            </div>

                            <div className="min-w-0">
                              <h2 className="truncate text-base font-semibold text-gray-900">
                                {module.title}
                              </h2>
                              <p className="mt-1 line-clamp-2 text-sm text-gray-500">
                                {module.description}
                              </p>

                              <div className="mt-4 flex flex-wrap items-center gap-3">
                                <ModuleStatusPill status={module.statusLabel} />

                                <span className="text-xs text-gray-400">
                                  {module.completedCount} of {module.videos.length} videos completed
                                </span>

                                <div className="ml-auto flex items-center gap-3">
                                  <Progress value={module.progressPercent} className="h-2 w-56 bg-teal-100" />
                                  <span className="text-xs font-medium text-gray-400">
                                    {module.progressPercent}%
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600">
                            <ChevronDown className="h-5 w-5" />
                          </span>
                        </div>
                      </AccordionTrigger>

                      <AccordionContent className="px-6 pb-6">
                        <div className="space-y-3 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                          {module.videos.map((video, index) => {
                            const status = normalizeStatus(video.status);
                            const isSelected = activeVideoId === video._id;

                            return (
                              <button
                                key={video._id}
                                type="button"
                                onClick={() => setActiveVideoId(video._id)}
                                className={[
                                  "flex w-full items-center justify-between gap-4 rounded-2xl border p-3 text-left transition",
                                  isSelected
                                    ? "border-teal-500 bg-white shadow-sm"
                                    : "border-gray-200 bg-gray-50 hover:bg-gray-100",
                                ].join(" ")}
                              >
                                <div className="flex min-w-0 items-center gap-4">
                                  <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                                    <Image
                                      src={video.thumbnailUrl || "/images/court.png"}
                                      alt={video.title}
                                      fill
                                      sizes="96px"
                                      className="object-cover"
                                    />
                                  </div>

                                  <div className="min-w-0">
                                    <div className="mb-1 flex items-center gap-2 text-xs text-gray-400">
                                      <span className="font-semibold text-gray-500">
                                        Video {index + 1}
                                      </span>

                                      <Badge
                                        variant="secondary"
                                        className={
                                          completedVideoIds.includes(video._id)
                                            ? "bg-teal-500 text-white hover:bg-teal-500"
                                            : "bg-gray-200 text-gray-600 hover:bg-gray-200"
                                        }
                                      >
                                        {completedVideoIds.includes(video._id) ? "Completed" : status.label}
                                      </Badge>
                                    </div>

                                    <p className="truncate text-sm font-semibold text-gray-900">
                                      {video.title}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex shrink-0 items-center gap-2 text-xs text-gray-400">
                                  <PlayCircle className="h-4 w-4 text-teal-500" />
                                  <span className="font-semibold">{formatDuration(video.durationSeconds)}</span>
                                </div>
                              </button>
                            );
                          })}

                          {module.videos.some((v) => v._id === activeVideoId) && activeVideo ? (
                            <div className="mt-2 rounded-2xl border border-gray-200 bg-white p-4">
                              <video
                                src={activeVideo.videoUrl}
                                controls
                                onPlay={() => activeVideoId && markVideoPlaying(activeVideoId)}
                                onPause={() => activeVideoId && markVideoNotPlaying(activeVideoId)}
                                onEnded={() => activeVideoId && markVideoCompleted(activeVideoId)}
                                className="w-full rounded-xl"
                              />
                              {activeVideo.description ? (
                                <p className="mt-3 text-sm text-gray-500">{activeVideo.description}</p>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}