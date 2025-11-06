"use client";
import { DashboardHeader } from '../../components/dashboard-header';
import { FeedCard } from '../../components/dashboard-feedCard';
import { MessagesOverview } from '../../components/dashboard-messagesOverview';
import { ContractsOverview } from '../../components/dashboard-contractsOverview';
import { ScrollArea } from '../../components/dashboard-scrollArea';
import Image from 'next/image';
import Link from 'next/link';


export default function Dashboard() {
    return (
    <div className="min-h-screen bg-white">
      <DashboardHeader />
      
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
