"use client";
import FeedCard from '../../components/dashboard-feedCard';
import MessagesOverview from '../../components/dashboard-messages';
import { ScrollArea } from '../../components/ui/scroll-area';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function Dashboard() {
  const [athleteId, setAthleteId] = useState<string | null>(null);
  const [feedPosts, setFeedPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const profileRes = await api.get('/profile');
        const id = profileRes.data?.profile?._id;
        if (typeof id === "string" && id) setAthleteId(id);

        const videoRes = await api.get('/videos'); 
        
        if (videoRes.data?.success) {
          const formattedPosts = videoRes.data.videos.map((video: any) => ({
            id: video._id,
            athleteName: video.athleteName || 'Unknown Athlete', 
            sport: video.sport || 'General',
            school: video.school || 'Unknown School',
            postType: 'video' as const,
            mediaUrl: video.videoUrl, 
            caption: video.description || video.title || '',
            likes: video.likes || 0,
            comments: video.comments || 0,
            timeAgo: 'Just now' 
          }));
          
          setFeedPosts(formattedPosts);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
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
        <div className="w-96 space-y-6">
          <MessagesOverview />
        </div>
      </div>
    </div>
  );
}