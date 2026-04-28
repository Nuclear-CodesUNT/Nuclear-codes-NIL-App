"use client";
import FeedCard from '../../components/dashboard-feedCard';
import MessagesOverview from '../../components/dashboard-messages';
import { ScrollArea } from '../../components/ui/scroll-area';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

function formatTimeAgo(dateString: string): string {
  if (!dateString) return 'Just now';

  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;

  const years = Math.floor(days / 365);
  return `${years}y ago`;
}

export default function Dashboard() {
  const [athleteId, setAthleteId] = useState<string | null>(null);
  const [feedPosts, setFeedPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      let currentUserId: string | null = null; // Track this outside the try blocks

      try {
        const profileRes = await api.get('/profile');
        const id = profileRes.data?.profile?._id;
        if (typeof id === "string" && id) {
          currentUserId = id;
          setAthleteId(id);
        }
      } catch (error) {
        console.log("Could not load profile, continuing to feed...");
      }

      try {
        const videoRes = await api.get('/videos');

        if (videoRes.data?.success) {
          const formattedPosts = videoRes.data.videos.map((video: any) => ({
            id: video._id, // Passing the video ID to the component
            athleteName: video.athleteName || 'Unknown Athlete',
            sport: video.sport || 'General',
            school: video.school || 'Unknown School',
            postType: 'video' as const,
            mediaUrl: video.videoUrl,
            caption: video.description || video.title || '',
            // Map the new like logic:
            likes: video.likedBy ? video.likedBy.length : 0,
            isLiked: video.likedBy && currentUserId ? video.likedBy.includes(currentUserId) : false,
            comments: video.comments || 0,
            timeAgo: formatTimeAgo(video.createdAt)
          }));

          setFeedPosts(formattedPosts);
        }
      } catch (error) {
        console.error("Failed to load feed data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="flex gap-6 p-6 max-w-[1600px] mx-auto">
        {/* Main Feed - Left Side */}
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1">
            <div className="space-y-4 pr-4 max-w-[700px] mx-auto">
              {isLoading ? (
                <p className="text-center text-gray-500">Loading feed...</p>
              ) : feedPosts.length > 0 ? (
                feedPosts.map((post) => (
                  <FeedCard key={post.id} {...post} athleteId={athleteId || undefined} />
                ))
              ) : (
                <p className="text-center text-gray-500">No posts available yet.</p>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Sidebar - Right Side */}
        <div className="w-96 space-y-6 sticky top-6 self-start">
          <MessagesOverview />
        </div>
      </div>
    </div>
  );
}