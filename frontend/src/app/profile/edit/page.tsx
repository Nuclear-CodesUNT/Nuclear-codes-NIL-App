'use client';

import { useState } from 'react';
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import { Trophy, MapPin, CalendarDays, Upload, Trash2, Plus } from "lucide-react"; // Image deleted
import "react-day-picker/style.css";
import Link from "next/link";
import Image from "next/image";

import api from '@/lib/api';

const MAX_GAME_DAYS = 6;

function dateKeyLocal(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function formatMMDDYYYYFromISO(iso: string): string {
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return "";
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = String(d.getFullYear());
  return `${mm}/${dd}/${yyyy}`;
}

function formatDateInputMMDDYYYY(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  const mm = digits.slice(0, 2);
  const dd = digits.slice(2, 4);
  const yyyy = digits.slice(4, 8);
  if (digits.length <= 2) return mm;
  if (digits.length <= 4) return `${mm}/${dd}`;
  return `${mm}/${dd}/${yyyy}`;
}

function parseMMDDYYYYToLocalDate(input: string): Date | null {
  const m = input.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return null;
  const mm = Number(m[1]);
  const dd = Number(m[2]);
  const yyyy = Number(m[3]);
  if (!Number.isFinite(mm) || !Number.isFinite(dd) || !Number.isFinite(yyyy)) return null;
  if (mm < 1 || mm > 12) return null;
  if (dd < 1 || dd > 31) return null;
  const d = new Date(yyyy, mm - 1, dd);
  // Ensure JS didn't roll the date (e.g., 02/31/2026).
  if (d.getFullYear() !== yyyy || d.getMonth() !== mm - 1 || d.getDate() !== dd) return null;
  return d;
}

interface GameDay {
  _id?: string; // exists if coming from DB
  date: string; // ISO string (important)
  homeAway: "Home" | "Away";
  opponent: string;
}

interface Highlight {
  highlightId: string;
  gameDayId: string;
  gameDay: { date: string; homeAway: "Home" | "Away"; opponent: string };
  videoId: string;
  title: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  addedAt?: string;
}

interface ExistingHighlight {
  highlightId: string;
  gameDayId: string;
  addedAt: string;
  title?: string;
  thumbnailUrl?: string;
}

interface AthleteInformation {
  playerName: string;
  sport?: string;
  position?: string;
  teamName?: string;
  location?: string;
  bio?: string;
  profilepicture?: string;
  gameDays?: GameDay[];
}

export default function EditAthleteProfile({
  playerName: initialPlayerName = "John Doe",
  sport: initialSport = "Basketball",
  position: initialPosition = "Point Guard",
  teamName: initialTeamName = "Lakers",
  location: initialLocation = "Los Angeles",
  bio: initialBio = "Professional basketball player with 5 years of experience in competitive leagues.",
  profilepicture: initialProfilePicture = "/images/ProfilepicPlaceholder.png",
}: AthleteInformation) {
  // Editable states
  const [playerName, setPlayerName] = useState(initialPlayerName);
  const [sport, setSport] = useState(initialSport);
  const [position, setPosition] = useState(initialPosition);
  const [teamName, setTeamName] = useState(initialTeamName);
  const [location, setLocation] = useState(initialLocation);
  const [bio, setBio] = useState(initialBio);
  const [profilepicture, setProfilePicture] = useState(initialProfilePicture);

  const [gameDays, setGameDays] = useState<GameDay[]>([]);
  const router = useRouter();

  const [gameDayLimitPopup, setGameDayLimitPopup] = useState<null | {
    message: string;
    pendingGameDays: GameDay[];
    selectedRemoveKey: string;
  }>(null);

  // Highlights
  const [athleteId, setAthleteId] = useState<string | null>(null);
  const [selectedHighlightDate, setSelectedHighlightDate] = useState<string>("");
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [uploading, setUploading] = useState(false);

  const parsedHighlightDate = parseMMDDYYYYToLocalDate(selectedHighlightDate);
  const selectedGameDayForHighlight = parsedHighlightDate
    ? gameDays.find((g) => dateKeyLocal(new Date(g.date)) === dateKeyLocal(parsedHighlightDate))
    : undefined;

  const [limitPopup, setLimitPopup] = useState<null | {
    message: string;
    existingHighlights: ExistingHighlight[];
    suggestedRemove?: ExistingHighlight;
    pendingVideoId: string;
    pendingGameDayId: string;
    selectedRemoveId: string;
  }>(null);

  // Stats
  const [stats, setStats] = useState<{ name: string; value: string }[]>([
    { name: "PPG", value: "25.3" },
    { name: "APG", value: "7.4" },
    { name: "RPG", value: "10.2" },
  ]);

  // Save handler
  const handleSave = async () => {
    try {
      // Convert stats array → object for MongoDB Map
      const statsObject: Record<string, string> = {};
      stats.forEach(s => {
        if (s.name.trim() !== "") {
          statsObject[s.name] = s.value;
        }
      });

      // Prep game days to save to mongo
      const cleanedGameDays = gameDays
        .filter(g => g.opponent.trim() !== "")
        .map(g => ({
          _id: g._id, // keep existing IDs if present
          date: new Date(g.date).toISOString(),
          homeAway: g.homeAway,
          opponent: g.opponent
        }))
        .sort(
          (a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );


      await api.put('/profile', {
        playerName,
        sport,
        position,
        teamName,
        location,
        bio,
        profilepicture,
        stats: statsObject,
        gameDays: cleanedGameDays,
      });

      alert("Profile updated successfully");
      router.push("/profile");

    } catch (err: any) {
      alert(err.response?.data?.error || "Network error saving profile");
    }
  };

  // Profile picture upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = () => setProfilePicture(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const refreshHighlights = useCallback(async (id: string) => {
    try {
      const { data } = await api.get(`/athletes/${id}/highlights`);
      setHighlights(Array.isArray(data.highlights) ? data.highlights : []);
    } catch {
      // ignore
    }
  }, []);

  async function attachHighlight(args: {
    videoId: string;
    gameDayId: string;
    replaceOldest?: boolean;
    removeHighlightId?: string;
  }) {
    try {
      const { data } = await api.post('/athletes/me/highlights', args);
      return { res: { ok: true, status: 200}, data };
    } catch (err: any) {
      return { 
        res: {
          ok: false,
          status: err.response?.status ?? 500,
        },
        data: err.response?.data ?? {},
      };
    }
  }

  // Highlight upload: upload -> attach
  const handleHighlightUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // reset input so selecting same file again still triggers
    e.target.value = "";

    const parsed = parseMMDDYYYYToLocalDate(selectedHighlightDate);
    if (!parsed) {
      alert("Enter a valid game date first (MM/DD/YYYY).");
      return;
    }

    const match = gameDays.find((g) => dateKeyLocal(new Date(g.date)) === dateKeyLocal(parsed));
    if (!match?._id) {
      alert("That game day isn't saved yet. Save your profile first, then attach highlights.");
      return;
    }

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", file.name.replace(/\.[^/.]+$/, ""));
      fd.append("status", "published");

      let vid: string;
      try {
        const { data: upData } = await api.post('/upload', fd);
        if (!upData?.video?._id) {
          alert(upData?.message || "Upload failed");
          return;
        }
        vid = String(upData.video._id);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any 
      catch (err: any) {
        alert(err.response?.data?.error || err.response?.data?.message || "Upload failed");
        return;
      }
      const { res: attRes, data: attData } = await attachHighlight({
        videoId: vid,
        gameDayId: String(match._id),
      });

      if (attRes.status === 409) {
        const existingHighlights: ExistingHighlight[] = Array.isArray(attData.existingHighlights)
          ? attData.existingHighlights
          : [];
        setLimitPopup({
          message: attData.message || "Maximum highlights reached.",
          existingHighlights,
          suggestedRemove: attData.suggestedRemove,
          pendingVideoId: vid,
          pendingGameDayId: String(match._id),
          selectedRemoveId: String(attData.suggestedRemove?.highlightId || ""),
        });
        return;
      }

      if (!attRes.ok) {
        alert(attData?.message || "Failed to attach highlight");
        return;
      }

      if (athleteId) await refreshHighlights(athleteId);
    } catch {
      alert("Network error uploading highlight");
    } finally {
      setUploading(false);
    }
  };

  // Delete highlight
  const handleDeleteHighlight = async (highlightId: string) => {
    if (!confirm("Remove this highlight from your profile?")) return;
    try {
      await api.delete(`/athletes/me/highlights/${highlightId}`);
      if (athleteId) await refreshHighlights(athleteId);
    } catch (err: any) {
      alert(err.response?.data?.message || "Network error removing highlight");
    }
  };

  // Add stat
  const handleAddStat = () => {
    setStats(prev => [...prev, { name: "", value: "" }]);
  };

  // Update stat
  const handleStatChange = (index: number, key: 'name' | 'value', value: string) => {
    setStats(prev => {
      const updated = [...prev];
      updated[index][key] = value;
      return updated;
    });
  };

  // Remove stat
  const handleRemoveStat = (index: number) => {
    setStats(prev => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await api.get('/profile');

        if (!data.profile) {
          console.error("Failed to load profile: no profile data");
          return;
        }

        const p = data.profile as {
          _id?: string;
          sport?: string;
          position?: string;
          teamName?: string;
          location?: string;
          bio?: string;
          profilepicture?: string;
          stats?: Record<string, unknown>;
          gameDays?: unknown;
        };

        setAthleteId(p?._id || null);

        setPlayerName(data.user.name || "");
        setSport(p?.sport || "");
        setPosition(p?.position || "");
        setTeamName(p?.teamName || "");
        setLocation(p?.location || "");
        setBio(p?.bio || "");
        setProfilePicture(p?.profilepicture || "/images/ProfilepicPlaceholder.png");

        // Convert MongoDB Map → array for UI
        if (p?.stats && typeof p.stats === "object") {
          const statsArray = Object.entries(p.stats).map(([name, value]) => ({
            name,
            value: String(value)
          }));

          setStats(statsArray);
        }
        else {
          setStats([]);
        }

        if (p?.gameDays && Array.isArray(p.gameDays)) {
          type RawGameDay = { _id?: unknown; date?: unknown; homeAway?: unknown; opponent?: unknown };

          const rawGameDays = p.gameDays as unknown[];
          const formattedGameDays: GameDay[] = rawGameDays
            .map((g: unknown) => {
              const rg = g as RawGameDay;
              const homeAway: GameDay["homeAway"] = rg.homeAway === "Away" ? "Away" : "Home";
              const d = new Date(String(rg.date || ""));
              const dateIso = Number.isFinite(d.getTime()) ? d.toISOString() : new Date().toISOString();
              return {
                _id: typeof rg._id === "string" ? rg._id : undefined,
                date: dateIso,
                homeAway,
                opponent: typeof rg.opponent === "string" ? rg.opponent : "",
              } as GameDay;
            })
            .sort((a, b) =>
              new Date(a.date).getTime() - new Date(b.date).getTime()
            );

          setGameDays(formattedGameDays);

          // default selection to the first saved game day
          const firstSaved = formattedGameDays.find((g) => !!g._id);
          if (firstSaved?._id) {
            setSelectedHighlightDate((prev) => prev || formatMMDDYYYYFromISO(firstSaved.date));
          }
        } else {
          setGameDays([]);
        }

        if (p?._id) {
          await refreshHighlights(String(p._id));
        }


      } catch (err) {
        console.error("Network error loading profile", err);
      }
    };

    loadProfile();
  }, [refreshHighlights]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 pt-12 px-6 md:px-12 max-w-full">

        {/* Left Column - Editable Profile */}
        <div className="flex flex-col gap-6 pr-4">

          {/* Profile Frame */}
          <div className="relative flex flex-col z-0 sm:flex-row items-center sm:items-start bg-white border border-gray-300 rounded-lg p-8 pb-6 gap-6">

            {/* New Section Title */}
            <h2 className="absolute -top-4 left-4 bg-white px-2 text-lg font-semibold">Basic Information</h2>


            {/* Profile picture */}
            <div className="flex flex-col items-center gap-2">
              <Image
                src={profilepicture}
                alt="Profile picture"
                width={160}
                height={160}
                className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border border-gray-200"
              />
              <label className="flex items-center gap-2 cursor-pointer text-sm text-blue-600 hover:underline">
                <Upload className="w-4 h-4" />
                <span>Change photo</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            </div>

            {/* Player Info */}
            <div className="flex flex-col gap-4 w-full">
              <div>
                <label className="text-sm font-medium text-gray-700">Player Name</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
              </div>

              <div className="flex flex-row gap-4 flex-wrap">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Sport</label>
                  <input
                    type="text"
                    value={sport}
                    onChange={(e) => setSport(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Position</label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2 mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-gray-600" /> Team
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-gray-600" /> Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={5}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1"
                />
              </div>
            </div>
          </div>

          {/* Stats Management */}
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl ">Season Statistics</h2>
              <button
                onClick={handleAddStat}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
              >
                <Plus className="w-4 h-4" /> Add Stat
              </button>
            </div>

            <div className="space-y-3">
              {stats.map((stat, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={stat.name}
                    onChange={(e) => handleStatChange(index, 'name', e.target.value)}
                    placeholder="Name (e.g. PPG)"
                    className="flex-1 border border-gray-300 rounded-md p-2"
                  />
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                    placeholder="Value (e.g. 25.3)"
                    className="flex-1 border border-gray-300 rounded-md p-2"
                  />
                  <button
                    onClick={() => handleRemoveStat(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights Upload Section */}
          <div className="bg-white border border-gray-300 rounded-lg p-6">
            <h2 className="text-xl mb-4">Video Highlights</h2>

            {/* Game date input */}
            <div className="mb-4">
              <label className="text-sm font-medium text-gray-700">Game date (MM/DD/YYYY)</label>
              <input
                value={selectedHighlightDate}
                onChange={(e) => {
                  const formatted = formatDateInputMMDDYYYY(e.target.value);
                  setSelectedHighlightDate(formatted);

                  const parsed = parseMMDDYYYYToLocalDate(formatted);
                  if (!parsed) {
                    return;
                  }

                  const match = gameDays.find((g) => dateKeyLocal(new Date(g.date)) === dateKeyLocal(parsed));
                  if (!match && gameDays.length >= MAX_GAME_DAYS) {
                    return;
                  }

                  // Ensure the game day exists in state so details can be edited/saved.
                  if (!match) {
                    setGameDays((prev) => {
                      const already = prev.some((g) => dateKeyLocal(new Date(g.date)) === dateKeyLocal(parsed));
                      if (already) return prev;
                      const next = [
                        ...prev,
                        {
                          _id: undefined,
                          date: parsed.toISOString(),
                          homeAway: "Home" as const,
                          opponent: "",
                        },
                      ].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                      return next;
                    });
                  }
                }}
                inputMode="numeric"
                placeholder="__/__/____"
                className="w-full border border-gray-300 rounded-md p-2 mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter a saved game date to attach highlights. New game days must be saved before attaching.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Home or Away</label>
                <select
                  value={selectedGameDayForHighlight?.homeAway || "Home"}
                  disabled={!selectedGameDayForHighlight}
                  onChange={(e) => {
                    if (!parsedHighlightDate) return;
                    const value = e.target.value as "Home" | "Away";
                    setGameDays((prev) =>
                      prev.map((g) =>
                        dateKeyLocal(new Date(g.date)) === dateKeyLocal(parsedHighlightDate)
                          ? { ...g, homeAway: value }
                          : g
                      )
                    );
                  }}
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 disabled:bg-gray-100"
                >
                  <option value="Home">Home</option>
                  <option value="Away">Away</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Opponent</label>
                <input
                  type="text"
                  value={selectedGameDayForHighlight?.opponent || ""}
                  disabled={!selectedGameDayForHighlight}
                  onChange={(e) => {
                    if (!parsedHighlightDate) return;
                    const opponent = e.target.value;
                    setGameDays((prev) =>
                      prev.map((g) =>
                        dateKeyLocal(new Date(g.date)) === dateKeyLocal(parsedHighlightDate)
                          ? { ...g, opponent }
                          : g
                      )
                    );
                  }}
                  placeholder="Team Name"
                  className="w-full border border-gray-300 rounded-md p-2 mt-1 disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* Drag & Drop Upload Box */}
            <div className="border-2 border-dashed border-gray-400 rounded-lg p-6 flex flex-col justify-center items-center gap-3 text-center">
              <Upload className="w-10 h-10 text-gray-500" />
              <p className="text-gray-600 font-medium">Drag and drop your video files here, or</p>

              <label className={`flex items-center gap-2 bg-black text-white px-4 py-2 rounded-md cursor-pointer hover:bg-gray-800 ${uploading ? "opacity-60 pointer-events-none" : ""}`}>
                <Plus className="w-5 h-5" /> Choose files
                <input type="file" accept="video/mp4,video/quicktime,video/webm" onChange={handleHighlightUpload} className="hidden" />
              </label>

              <p className="text-xs text-gray-500 mt-1">Supports: MP4, MOV, WEBM (Max 500MB per file)</p>
            </div>

            {/* Uploaded Highlights Grid */}
            <h3 className="text-lg font-medium mt-6 mb-2">Uploaded Highlights</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {highlights.map((highlight) => (
                <div
                  key={highlight.highlightId}
                  className="relative border rounded-lg overflow-hidden flex flex-col"
                >
                  <Image
                    src={highlight.thumbnailUrl || "/images/court.png"}
                    alt={highlight.title || "Highlight thumbnail"}
                    width={640}
                    height={360}
                    className="w-full h-40 object-cover"
                  />

                  <div className="p-3 flex flex-col">
                    {/* Title with Gray Background */}
                    <div className="bg-gray-200 rounded-md px-2 py-1 text-sm font-medium text-gray-800 truncate">
                      {highlight.title || "Highlight"}
                    </div>

                    <div className="text-xs text-gray-600 mt-1 truncate">
                      {highlight.gameDay?.date ? new Date(highlight.gameDay.date).toLocaleDateString() : ""}
                      {highlight.gameDay?.date ? " — " : ""}
                      {highlight.gameDay?.homeAway} vs {highlight.gameDay?.opponent}
                    </div>

                    {/* Upload Date + Delete Button Row */}
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs text-gray-500">
                        Game day: {highlight.gameDay?.date ? new Date(highlight.gameDay.date).toLocaleDateString() : ""}
                      </p>
                      <button
                        onClick={() => handleDeleteHighlight(highlight.highlightId)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {highlights.length === 0 && (
              <p className="text-sm text-gray-500 mt-3">No highlights uploaded yet.</p>
            )}
          </div>

          {/* Save / Cancel */}
          <div className="flex justify-end gap-3 mt-6 pb-12">
            <Link
              href="/profile"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Link>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Right Column - Calendar */}
        <div className="w-full sm:w-[300px] md:w-[400px] lg:w-[450px] xl:w-[500px] p-6 py-4 sticky top-24  border rounded-lg border-gray-200 self-start bg-white">
          <div className="flex gap-2 mb-4">
            <CalendarDays className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg">Game Schedule</h2>
          </div>

          {/* Calendar + Game Days */}
          <div className="w-full bg-gray-50 border border-gray-200 rounded p-1">
            <div className="flex justify-center">
              <DayPicker
                mode="multiple"
                required={false}
                // Convert ISO strings → Date objects for DayPicker
                selected={gameDays.map((g) => new Date(g.date))}
                onSelect={(dates) => {
                  if (!dates) return;

                  // Build the next selection while preserving existing details
                  const existing = [...gameDays];
                  const next: GameDay[] = [];

                  for (const d of dates) {
                    const match = existing.find((g) => new Date(g.date).getTime() === d.getTime());
                    if (match) {
                      next.push(match);
                    } else {
                      next.push({
                        _id: undefined,
                        date: d.toISOString(),
                        homeAway: "Home",
                        opponent: "",
                      });
                    }
                  }

                  if (next.length > MAX_GAME_DAYS) {
                    // Don't apply the selection yet; ask user what to remove.
                    const newest = next[next.length - 1];
                    setGameDayLimitPopup({
                      message: `Only ${MAX_GAME_DAYS} game days can be selected at once. Choose one to remove.`,
                      pendingGameDays: next,
                      selectedRemoveKey: newest?.date || "",
                    });
                    return;
                  }

                  setGameDays(next);
                }}
                showOutsideDays
                className="w-full max-w-[350px]"
                styles={{
                  months: { display: "flex", justifyContent: "left", width: "100%" },
                  month: { width: "100%" },
                  head_cell: { padding: "0.5rem" },
                  day: { padding: "0.4rem" },
                }}
              />
            </div>
          </div>

          {/* Selected Game Days List removed (per UX request) */}
        </div>
      </div>

      {/* Max-6 popup */}
      {limitPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-gray-200 p-5 w-full max-w-xl">
            <div className="text-lg font-semibold">Maximum highlights reached</div>
            <div className="text-sm text-gray-600 mt-1">{limitPopup.message}</div>

            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Choose a highlight to remove</div>
              <div className="max-h-60 overflow-auto border border-gray-200 rounded">
                {limitPopup.existingHighlights.map((h) => (
                  <label
                    key={h.highlightId}
                    className="flex items-center gap-3 p-3 border-b last:border-b-0 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="removeHighlight"
                      checked={limitPopup.selectedRemoveId === h.highlightId}
                      onChange={() =>
                        setLimitPopup((prev) =>
                          prev ? { ...prev, selectedRemoveId: h.highlightId } : prev
                        )
                      }
                    />
                    <Image
                      src={h.thumbnailUrl || "/images/court.png"}
                      alt={h.title || "Highlight thumbnail"}
                      width={56}
                      height={40}
                      className="w-14 h-10 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{h.title || "Highlight"}</div>
                      <div className="text-xs text-gray-500">Added: {new Date(h.addedAt).toLocaleDateString()}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-3 py-2 border border-gray-300 rounded-md"
                onClick={() => setLimitPopup(null)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 border border-gray-300 rounded-md"
                onClick={async () => {
                  const current = limitPopup;
                  setLimitPopup(null);
                  setUploading(true);
                  try {
                    const { res, data } = await attachHighlight({
                      videoId: current.pendingVideoId,
                      gameDayId: current.pendingGameDayId,
                      replaceOldest: true,
                    });
                    if (!res.ok) {
                      alert(data?.message || "Failed to replace oldest highlight");
                      return;
                    }
                    if (athleteId) await refreshHighlights(athleteId);
                  } finally {
                    setUploading(false);
                  }
                }}
              >
                Replace Oldest
              </button>
              <button
                className="px-3 py-2 bg-black text-white rounded-md disabled:opacity-50"
                disabled={!limitPopup.selectedRemoveId}
                onClick={async () => {
                  const current = limitPopup;
                  setLimitPopup(null);
                  setUploading(true);
                  try {
                    const { res, data } = await attachHighlight({
                      videoId: current.pendingVideoId,
                      gameDayId: current.pendingGameDayId,
                      removeHighlightId: current.selectedRemoveId,
                    });
                    if (!res.ok) {
                      alert(data?.message || "Failed to replace selected highlight");
                      return;
                    }
                    if (athleteId) await refreshHighlights(athleteId);
                  } finally {
                    setUploading(false);
                  }
                }}
              >
                Replace Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Max selected game days popup */}
      {gameDayLimitPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-gray-200 p-5 w-full max-w-xl">
            <div className="text-lg font-semibold">Maximum game days reached</div>
            <div className="text-sm text-gray-600 mt-1">{gameDayLimitPopup.message}</div>

            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Choose a game day to remove</div>
              <div className="max-h-60 overflow-auto border border-gray-200 rounded">
                {gameDayLimitPopup.pendingGameDays
                  .slice()
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map((g) => (
                    <label
                      key={g.date}
                      className="flex items-center gap-3 p-3 border-b last:border-b-0 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="removeGameDay"
                        checked={gameDayLimitPopup.selectedRemoveKey === g.date}
                        onChange={() =>
                          setGameDayLimitPopup((prev) =>
                            prev ? { ...prev, selectedRemoveKey: g.date } : prev
                          )
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {new Date(g.date).toLocaleDateString()} — {g.homeAway} vs {g.opponent || "(opponent)"}
                        </div>
                        {!g._id && (
                          <div className="text-xs text-gray-500">New (not saved yet)</div>
                        )}
                      </div>
                    </label>
                  ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                className="px-3 py-2 border border-gray-300 rounded-md"
                onClick={() => setGameDayLimitPopup(null)}
              >
                Cancel
              </button>
              <button
                className="px-3 py-2 bg-black text-white rounded-md disabled:opacity-50"
                disabled={!gameDayLimitPopup.selectedRemoveKey}
                onClick={() => {
                  const current = gameDayLimitPopup;
                  const reduced = current.pendingGameDays.filter((g) => g.date !== current.selectedRemoveKey);

                  if (reduced.length > MAX_GAME_DAYS) {
                    // Still too many (edge case: user selected a bunch quickly). Ask again.
                    const newest = reduced[reduced.length - 1];
                    setGameDayLimitPopup({
                      ...current,
                      pendingGameDays: reduced,
                      selectedRemoveKey: newest?.date || "",
                    });
                    return;
                  }

                  setGameDays(reduced);
                  setGameDayLimitPopup(null);
                }}
              >
                Remove Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
