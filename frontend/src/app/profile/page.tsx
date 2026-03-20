'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { DayPicker } from "react-day-picker";
import { Share2, UserPlus, MessageSquare, Trophy, MapPin, CalendarDays, Eye, ThumbsUp, MessageCircle } from "lucide-react";
import "react-day-picker/style.css";
import Image from 'next/image';

interface GameDay {
  _id: string;
  date: string;
  homeAway: "Home" | "Away";
  opponent: string;
}

interface AthleteInformation {
  userId: string;
  athleteId?: string;
  playerName: string;
  sport?: string;
  position?: string;
  teamName?: string;
  location?: string;
  bio?: string;
  profilepicture?: string;
  stats?: Array<[string, string]>;
  gameDays?: GameDay[];
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


export default function AthleteProfile() {
  const [profile, setProfile] = useState<AthleteInformation | null>(null);
  const [loggedInUserId, setLoggedInUserId] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [activeHighlightId, setActiveHighlightId] = useState<string>("");
  const [highlightsError, setHighlightsError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

        const res = await fetch(`${API_ORIGIN}/api/profile`, {
          credentials: "include"
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load profile");
          setLoading(false);
          return;
        }

        const athleteId = data.profile?._id;

        setProfile({
          userId: data.profile.userId,
          athleteId,
          playerName: data.user.name,
          sport: data.profile?.sport,
          position: data.profile?.position,
          teamName: data.profile?.teamName,
          location: data.profile?.location,
          bio: data.profile?.bio,
          profilepicture: data.profile?.profilepicture,
          stats: data.profile?.stats ? Object.entries(data.profile.stats) : [],
          gameDays: data.profile?.gameDays || []
        });

        if (athleteId) {
          try {
            setHighlightsError("");
            const hRes = await fetch(`${API_ORIGIN}/api/athletes/${athleteId}/highlights`, {
              credentials: "include",
            });
            const hData = await hRes.json().catch(() => ({}));
            if (!hRes.ok) {
              setHighlightsError(hData?.message || hData?.error || `Failed to load highlights (HTTP ${hRes.status})`);
            } else {
              const list: Highlight[] = Array.isArray(hData.highlights) ? hData.highlights : [];
              setHighlights(list);
              if (list.length > 0) {
                setActiveHighlightId((prev) => prev || String(list[0].highlightId));
              }
            }
          } catch {
            setHighlightsError("Could not reach highlights API");
          }
        }

        setLoggedInUserId(data.user._id);
        setLoading(false);
      } catch {
        setError("Network error");
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-lg">Loading profile...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-red-600 text-lg">{error}</div>;
  }

  const gameDates: Date[] = profile?.gameDays?.map((g) => new Date(g.date)) || [];
  const activeHighlight = highlights.find((h) => String(h.highlightId) === String(activeHighlightId)) || null;
  const activeVideoUrl = activeHighlight?.videoUrl || "";

  const formatGameDayLine = (gd: Highlight["gameDay"]) => {
    const d = new Date(String(gd?.date || ""));
    const dateLabel = Number.isFinite(d.getTime()) ? d.toLocaleDateString() : "";
    const matchup = `${gd.homeAway} vs ${gd.opponent}`;
    return dateLabel ? `${matchup} • ${dateLabel}` : matchup;
  };

  const formatHighlightCardDate = (h: Highlight) => {
    // Keep thumbnail date in sync with the title's game-day date.
    const gameDayDate = h?.gameDay?.date ? new Date(String(h.gameDay.date)) : null;
    if (gameDayDate && Number.isFinite(gameDayDate.getTime())) {
      return gameDayDate.toLocaleDateString();
    }

    const addedAt = h?.addedAt ? new Date(String(h.addedAt)) : null;
    return addedAt && Number.isFinite(addedAt.getTime()) ? addedAt.toLocaleDateString() : "";
  };

  return (
    <>
      {/* Main container*/}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 pt-12 px-6 md:px-12 max-w-full">

        {/* Left Column Player Profile/Highlights */}
        <div className="flex flex-col gap-6 pr-4">

          {/* Player Profile Frame */} {/* Scaling tweaks needed to fix smaller screen flexing */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start bg-white border border-gray-300 rounded-lg p-8 pb-1 gap-6 relative">
            {/* Edit Profile Button */}
            {profile?.userId === loggedInUserId && (
              <Link
                href="/profile/edit"
                className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 hover:bg-gray-300 text-sm border border-gray-300 rounded-md"
              >
                Edit Profile
              </Link>
            )}

            {/* Profile picture */}
            <div className="flex-shrink-0">
              <Image
                src={profile?.profilepicture || "/images/ProfilepicPlaceholder.png"}
                alt="Profile picture"
                width={160}
                height={160}
                className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border border-gray-200"
              />
            </div>

            {/* Player Info */}
            <div className="flex flex-col gap-4 w-full">
              <div className="text-lg">{profile?.playerName}</div>

              {/* Sport/Position */}
              <div className="flex flex-row gap-2 flex-wrap">
                <div className="border border-gray-300 bg-gray-300 rounded-lg px-2 text-center text-sm self-start w-auto">
                  {profile?.sport}
                </div>
                <div className="border border-gray-400 rounded-lg px-2 text-center text-sm self-start w-auto">
                  {profile?.position}
                </div>
              </div>

              {/* Team Name */}
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gray-600" />
                <span>Team:</span> {profile?.teamName}
              </div>

              {/* Location */}
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-600" />
                <span>Location:</span> {profile?.location}
              </div>

              {/* Bio */}
              <div>
                {profile?.bio}
              </div>

              {/* Stats Section */}
              <div className="mt-6">
                <div className="grid grid-cols-1 gap-4">
                  {profile?.stats && profile.stats.length > 0 && (
                    <div className="mt-6">
                      <div className="grid grid-cols-3 gap-4">
                        {profile.stats.map(([name, value]) => (
                          <div
                            key={name}
                            className="flex flex-col items-center justify-center w-full bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm"
                          >
                            <span className="text-gray-900">{value}</span>
                            <span className="text-sm font-bold">{name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Buttons */}
                <div className="flex justify-end gap-3 py-5">
                  <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded">
                    <Share2 className="w-5 h-5" /> Share
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded">
                    <UserPlus className="w-5 h-5" /> Follow
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-black hover:bg-gray-900 text-white rounded">
                    <MessageSquare className="w-5 h-5" /> Message
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Highlights Section */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Highlights</h2>
              <span className="text-sm text-gray-500">{highlights.length} Videos</span>
            </div>

            {highlightsError && (
              <div className="mb-3 text-sm text-red-600">
                {highlightsError}
              </div>
            )}

            {/* Large video player */}
            {activeVideoUrl && (
              <div className="relative bg-black aspect-video rounded-lg overflow-hidden border border-gray-200 mb-3">
                <video
                  key={activeHighlightId}
                  src={activeVideoUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Active highlight title + associated game day (YouTube-style) */}
            {activeHighlight && (
              <div className="mb-6">
                <div className="text-base sm:text-lg font-semibold text-gray-900">
                  {activeHighlight.title || "Highlight"}
                </div>
                <div className="text-sm text-gray-600">
                  {formatGameDayLine(activeHighlight.gameDay)}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {highlights.length > 0 ? (
                highlights.map((highlight) => (
                  <button
                    key={highlight.highlightId}
                    type="button"
                    onClick={() => setActiveHighlightId(String(highlight.highlightId))}
                    className="overflow-hidden rounded-lg border border-gray-200 flex flex-col"
                    aria-label={highlight.title || "Highlight"}
                  >
                    <div className="w-full h-40 sm:h-48 overflow-hidden">
                      <Image
                        src={highlight.thumbnailUrl || "/images/court.png"}
                        alt={highlight.title || "Highlight"}
                        width={640}
                        height={360}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="p-3 flex flex-col gap-1">
                      <h3 className="text-sm font-semibold text-gray-800 truncate">
                        {highlight.title || "Highlight"}
                      </h3>

                      <div className="flex gap-4 text-xs text-gray-700">
                        <div className="flex items-center gap-1"><Eye className="w-4 h-4" />--</div>
                        <div className="flex items-center gap-1"><ThumbsUp className="w-4 h-4" />--</div>
                        <div className="flex items-center gap-1"><MessageCircle className="w-4 h-4" />--</div>
                      </div>

                      <div className="text-xs text-gray-500">
                        {formatHighlightCardDate(highlight)}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-sm text-gray-500">No highlights yet.</div>
              )}

            </div>
          </div>

        </div> {/* End Left Column */}

        {/* Right Column Game Schedule Sidebar */}
        <div className="w-full sm:w-[300px] md:w-[400px] lg:w-[450px] xl:w-[500px] p-6 py-4 top-25 sticky border rounded-lg border-gray-200 self-start"> {/* Scaling tweaks needed here */}
          <div className="flex gap-2 mb-4">
            <CalendarDays className="w-5 h-5 text-gray-700" />
            <h2>Game Schedule</h2>
          </div>

          <div className="mb-6">
            <div className="w-full bg-white border border-gray-200 rounded p-3">
              <div className="flex justify-center">
                <DayPicker
                  showOutsideDays
                  selected={gameDates} // highlight selected dates
                  modifiers={{
                    gameDay: gameDates,
                  }}
                  modifiersClassNames={{
                    gameDay: "bg-blue-100 rounded-full", // circle and color
                  }}
                  className="w-full max-w-[350px]"
                  styles={{
                    months: { display: 'flex', justifyContent: 'center', width: '100%' },
                    month: { width: '100%' },
                    head_cell: { padding: '0.5rem' },
                    day: { padding: '0.95rem' },
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            {/* Game Days */}
            <ul className="space-y-4">
              {profile?.gameDays && profile.gameDays.length > 0 ? (
                profile.gameDays
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(a.date).getTime() - new Date(b.date).getTime()
                  )
                  .map((game) => (
                    <li
                      key={game._id}
                      className="p-4 bg-gray-200 rounded-lg grid grid-cols-[1fr_auto] gap-2 items-center"
                    >
                      {/* Left column */}
                      <div className="flex flex-col gap-1 px-1">
                        {/* Row 1 opponent + home/away badge */}
                        <span className="text-lg">
                          vs {game.opponent}
                          <span
                            className={`text-sm font-normal border px-2 py-1 rounded-lg ml-3 ${game.homeAway === "Home"
                              ? "bg-green-100 text-green-700 border-green-300"
                              : "bg-blue-100 text-blue-700 border-blue-300"
                              }`}
                          >
                            {game.homeAway}
                          </span>
                        </span>

                        {/* Row 2 full date */}
                        <span className="text-sm text-gray-600">
                          {new Date(game.date).toLocaleDateString(undefined, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      {/* Right column – short date */}
                      <span className="text-xs text-gray-500 text-right">
                        {new Date(game.date).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </li>
                  ))
              ) : (
                <li className="text-sm text-gray-500 text-center py-4">
                  No games scheduled
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
