"use client";

import { Heart, MessageCircle, Share2, Play } from 'lucide-react';
import { useState } from 'react';
import { Card } from './ui/card';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import api from '@/lib/api';

interface FeedCardProps {
  id: string;
  athleteName: string;
  sport: string;
  school: string;
  postType: 'video' | 'image';
  mediaUrl: string;
  caption: string;
  likes: number;
  isLiked?: boolean;
  comments: any[];
  timeAgo: string;
  avatarUrl?: string;
  athleteId?: string; // Athlete document _id (used for highlights fetch)
  currentUserName?: string; 
}

export default function FeedCard({
  id,
  athleteName,
  sport,
  school,
  postType,
  mediaUrl,
  caption,
  likes,
  isLiked,
  comments,
  timeAgo,
  avatarUrl,
  athleteId,
  currentUserName
}: FeedCardProps) {

  // Local state for the optimistic UI
  const [liked, setLiked] = useState(isLiked || false);
  const [likeCount, setLikeCount] = useState(likes || 0);

  // Comment states
  const [showComments, setShowComments] = useState(false);
  const [commentList, setCommentList] = useState(comments || []);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLikeClick = async () => {
    if (!athleteId) return; // Prevent liking if not logged in

    // Optimistic UI toggle
    setLiked(!liked);
    setLikeCount((prev) => liked ? prev - 1 : prev + 1);

    try {
      // Fire the request to the backend
      await api.post(`/videos/${id}/like`, { userId: athleteId });
    } catch (error) {
      console.error("Failed to toggle like", error);
      // Revert if the server fails
      setLiked(liked);
      setLikeCount((prev) => liked ? prev + 1 : prev - 1);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !athleteId) return;

    setIsSubmitting(true);
    try {
      const res = await api.post(`/videos/${id}/comment`, {
        userId: athleteId,
        userName: currentUserName || "User", 
        text: newComment.trim()
      });

      if (res.data?.success) {
        setCommentList([...commentList, res.data.comment]);
        setNewComment('');
      }
    } catch (error) {
      console.error("Failed to post comment", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white border-gray-200 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* <Avatar className="h-10 w-10 border-2 border-[#00D9FF]">
            {avatarUrl ? (
              <ImageWithFallback src={avatarUrl} alt={athleteName} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-[#2B3359] flex items-center justify-center text-white">
                {athleteName.charAt(0)}
              </div>
            )}
          </Avatar>*/}
          <div>
            <p className="text-[#1F2642]">{athleteName}</p>
            <p className="text-gray-600 text-sm">{sport} • {school}</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-[#00D9FF]/10 text-[rgb(0,0,0)] border-[#00D9FF]">
          {postType}
        </Badge>
      </div>

      {/* Media */}
      <div className="relative bg-black aspect-video">
        {/**<ImageWithFallback 
          src={mediaUrl} 
          alt={caption}
          className="w-full h-full object-cover"
        />**/}
        
        {/* 3. Simplified Video Player Logic */}
        {postType === "video" && mediaUrl ? (
          <video
            src={mediaUrl}
            controls
            className="w-full h-full object-cover"
          />
        ) : postType === "video" ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center">
              <Play className="h-8 w-8 text-[#2B3359] ml-1" fill="#2B3359" />
            </div>
          </div>
        ) : null}
      </div>

      {/* Content & Actions */}
      <div className="p-5">
        <p className="text-[#1F2642] mb-4 text-base">{caption}</p>

        {/* Actions (Share Removed) */}
        <div className="flex items-center justify-between text-gray-500 pt-2">
          <div className="flex items-center gap-6">
            <button 
              onClick={handleLikeClick}
              className={`flex items-center gap-2 transition-colors ${liked ? 'text-red-500' : 'hover:text-[#00D9FF]'}`}
            >
              <Heart className="h-6 w-6" fill={liked ? 'currentColor' : 'none'} />
              <span className="font-medium">{likeCount}</span>
            </button>
            <button 
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2 hover:text-[#00D9FF] transition-colors"
            >
              <MessageCircle className="h-6 w-6" />
              <span className="font-medium">{commentList.length}</span>
            </button>
          </div>
          <span className="text-sm text-gray-400">{timeAgo}</span>
        </div>

        {/* Interactive Comments Section */}
        {showComments && (
          <div className="mt-5 pt-5 border-t border-gray-100 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-4 max-h-48 overflow-y-auto mb-4 pr-2 custom-scrollbar">
              {commentList.length > 0 ? (
                commentList.map((c: any, i: number) => (
                  <div key={i} className="text-sm bg-gray-50 p-3 rounded-lg">
                    <span className="font-bold text-[#1F2642] mr-2">{c.userName}</span>
                    <span className="text-gray-700">{c.text}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400 italic">No comments yet. Start the conversation!</p>
              )}
            </div>

            <form onSubmit={handleCommentSubmit} className="flex gap-3 items-center mt-2">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-full px-5 py-2.5 focus:outline-none focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF] transition-all"
                disabled={!athleteId || isSubmitting}
              />
              <button
                type="submit"
                disabled={!newComment.trim() || !athleteId || isSubmitting}
                className="text-sm font-bold text-white bg-[#2B3359] hover:bg-[#1a1f36] px-5 py-2.5 rounded-full disabled:opacity-50 transition-colors"
              >
                Post
              </button>
            </form>
          </div>
        )}
      </div>
    </Card>
  );
}