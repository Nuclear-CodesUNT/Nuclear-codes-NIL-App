"use client";
import React, { useEffect, useState } from 'react';
import { MessageSquare, MoreHorizontal } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar } from './ui/avatar';
import Link from 'next/link';
import api from '@/lib/api';

interface ApiConversation {
    conversationId: string;
    lastMessage?: { message: string; time: string };
    otherUser?: { name: string; role?: string };
}

export default function MessagesOverview() {
    const [conversations, setConversations] = useState<ApiConversation[]>([]);

    const MAX_VISIBLE = 8;
    const totalActive = conversations.length;
    const hasMore = totalActive > MAX_VISIBLE;
    const visibleConversations = hasMore ? conversations.slice(0, MAX_VISIBLE) : conversations;

    useEffect(() => {
        api.get('/messages/conversations')
            .then(res => setConversations(res.data.conversations || []))
            .catch(console.error);
    }, []);

    return (
        <Card className="bg-white border-gray-200 shadow-sm flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-[#00D9FF]" />
                    <Link href="/messages" className="hover:text-blue-600 transition-colors cursor-pointer">
                        <h2 className="text-[#1F2642] font-semibold">Messages</h2>
                    </Link>
                </div>
                <Badge
                    variant="secondary"
                    className="bg-[#00D9FF] text-white"
                    title={`${totalActive} Active`}
                    aria-label={`${totalActive} Active`}
                >
                    {hasMore ? `${MAX_VISIBLE}+ Active` : `${totalActive} Active`}
                </Badge>
            </div>

            <div className="divide-y divide-gray-200">
                {conversations.length === 0 ? (
                    <p className="p-4 text-sm text-gray-500 text-center">No messages yet.</p>
                ) : (
                    <>
                        {visibleConversations.map((conv) => {
                            const name = conv.otherUser?.name || 'Unknown';
                            const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

                            return (
                                <Link href={`/messages?chat=${conv.conversationId}`} key={conv.conversationId}>
                                    <div className="p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                                        <div className="flex items-start gap-3">
                                            <Avatar className="h-10 w-10">
                                                <div className="h-full w-full bg-[#2B3359] flex items-center justify-center text-white text-sm">
                                                    {initials}
                                                </div>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <p className="text-[#1F2642] text-sm truncate">{name}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm text-gray-600 truncate">
                                                        {conv.lastMessage?.message || 'New conversation'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}

                        {hasMore && (
                            <Link href="/messages" aria-label="View more conversations">
                                <div className="p-3 hover:bg-gray-50 cursor-pointer transition-colors flex items-center justify-center">
                                    <MoreHorizontal className="h-5 w-5 text-gray-500" />
                                </div>
                            </Link>
                        )}
                    </>
                )}
            </div>
        </Card>
    );
}