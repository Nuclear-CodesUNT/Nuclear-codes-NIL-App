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
  const [currentUserName, setCurrentUserName] = useState<string>(""); // New state
  const [feedPosts, setFeedPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      let currentUserId: string | null = null; // Track this outside the try blocks

      try {
        const profileRes = await api.get('/profile');
        const id = profileRes.data?.profile?._id;

        const firstName = profileRes.data?.profile?.firstName || "";
        const lastName = profileRes.data?.profile?.lastName || "";
        const fullName = `${firstName} ${lastName}`.trim();
        
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
            comments: video.comments || [],
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
    <div className="min-h-screen bg-gray-50/50"> {/* Softer background color */}
      {/* Increased gap, centered layout, removed max-w restriction constraint */}
      <div className="flex justify-center gap-10 p-8 max-w-[1400px] mx-auto">
        
        {/* Main Feed - Left Side */}
        <div className="flex-1 max-w-[750px]"> {/* Increased max-width of feed cards */}
          <ScrollArea className="h-[calc(100vh-4rem)]"> {/* Proper scroll boundaries */}
            {/* Increased space-y-8 for more vertical whitespace between cards */}
            <div className="space-y-8 pr-4 pb-10">
              {isLoading ? (
                <div className="flex justify-center py-10">
                   <p className="text-gray-500 font-medium">Loading feed...</p>
                </div>
              ) : feedPosts.length > 0 ? (
                feedPosts.map((post) => (
                  <FeedCard 
                    key={post.id} 
                    {...post} 
                    athleteId={athleteId || undefined} 
                    currentUserName={currentUserName} 
                  />
                ))
              ) : (
                <div className="flex justify-center py-10">
                   <p className="text-gray-500 font-medium">No posts available yet.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Sidebar - Right Side */}
        <div className="w-[400px] hidden lg:block sticky top-8 self-start">
          <MessagesOverview />
        </div>
      </div>
    </div>
  );
}