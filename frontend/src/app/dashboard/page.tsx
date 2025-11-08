"use client";
import FeedCard from '../../components/dashboard-feedCard';
import MessagesOverview from '../../components/dashboard-messages';
import ContractsOverview from '../../components/dashboard-contracts';
import { ScrollArea } from '../../components/ui/scroll-area';
import Image from 'next/image';
import Link from 'next/link';

const feedData = [
  {
    id: '1',
    athleteName: 'Alex Rivera',
    sport: 'Soccer',
    school: 'Stanford',
    postType: 'video' as const,
    mediaUrl: 'https://images.unsplash.com/photo-1551280857-2b9bbe52acf4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBwbGF5ZXIlMjBmaWVsZHxlbnwxfHx8fDE3NjEyMTY3NjJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    caption: 'Game-winning goal in overtime! What a match ⚽️',
    likes: 2156,
    comments: 143,
    timeAgo: '8h ago'
  }
];

export default function Dashboard() {
    return (
    <div className="min-h-screen bg-white">      
      <div className="flex gap-6 p-6 max-w-[1600px] mx-auto">
        {/* Main Feed - Left Side */}
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1">
            <div className="space-y-4 pr-4 max-w-[700px] mx-auto">
              {feedData.map((post) => (
                <FeedCard key={post.id} {...post} />
              ))}
            </div>
          </ScrollArea>
        </div>

        {/* Sidebar - Right Side */}
        <div className="w-96 space-y-6">
          <MessagesOverview />
          <ContractsOverview />
        </div>
      </div>
    </div>
  );
}
