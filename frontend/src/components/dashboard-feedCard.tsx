import { Heart, MessageCircle, Share2, Play } from 'lucide-react';
import { Card } from './ui/card';
import { Avatar } from './ui/avatar';
//import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';

interface FeedCardProps {
  athleteName: string;
  sport: string;
  school: string;
  postType: 'video' | 'image';
  mediaUrl: string;
  caption: string;
  likes: number;
  comments: number;
  timeAgo: string;
  avatarUrl?: string;
}

export default function FeedCard({
  athleteName,
  sport,
  school,
  postType,
  mediaUrl,
  caption,
  likes,
  comments,
  timeAgo,
  avatarUrl
}: FeedCardProps) {
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
        {postType === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <div className="h-16 w-16 rounded-full bg-white/90 flex items-center justify-center">
              <Play className="h-8 w-8 text-[#2B3359] ml-1" fill="#2B3359" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-[#1F2642] mb-3">{caption}</p>
        
        {/* Actions */}
        <div className="flex items-center justify-between text-gray-600">
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 hover:text-[#00D9FF] transition-colors">
              <Heart className="h-5 w-5" />
              <span>{likes}</span>
            </button>
            <button className="flex items-center gap-2 hover:text-[#00D9FF] transition-colors">
              <MessageCircle className="h-5 w-5" />
              <span>{comments}</span>
            </button>
            <button className="flex items-center gap-2 hover:text-[#00D9FF] transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
          <span className="text-sm">{timeAgo}</span>
        </div>
      </div>
    </Card>
  );
}
