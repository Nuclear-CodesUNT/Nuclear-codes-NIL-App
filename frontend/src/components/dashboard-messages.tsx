import { MessageSquare, Send, CheckCheck, Circle } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Avatar } from './ui/avatar';

interface Message {
  id: string;
  athleteName: string;
  lastMessage: string;
  status: 'sent' | 'read' | 'new';
  timestamp: string;
  avatarInitial: string;
}

const mockMessages: Message[] = [
  {
    id: '1',
    athleteName: 'Marcus Johnson',
    lastMessage: 'Sounds great! Let\'s discuss the details.',
    status: 'new',
    timestamp: '2m ago',
    avatarInitial: 'MJ'
  },
  {
    id: '2',
    athleteName: 'Sarah Williams',
    lastMessage: 'Thank you for the opportunity!',
    status: 'read',
    timestamp: '1h ago',
    avatarInitial: 'SW'
  },
  {
    id: '3',
    athleteName: 'Tyler Brown',
    lastMessage: 'Can we schedule a call?',
    status: 'sent',
    timestamp: '3h ago',
    avatarInitial: 'TB'
  },
  {
    id: '4',
    athleteName: 'Emma Davis',
    lastMessage: 'I reviewed the contract terms.',
    status: 'new',
    timestamp: '5h ago',
    avatarInitial: 'ED'
  },
  {
    id: '5',
    athleteName: 'James Wilson',
    lastMessage: 'Looking forward to working together!',
    status: 'read',
    timestamp: '1d ago',
    avatarInitial: 'JW'
  }
];

export default function MessagesOverview() {
  return (
    <Card className="bg-white border-gray-200 shadow-sm">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-[#00D9FF]" />
          <h2 className="text-[#1F2642]">Messages</h2>
        </div>
        <Badge variant="secondary" className="bg-[#00D9FF] text-white">
          {mockMessages.filter(m => m.status === 'new').length} New
        </Badge>
      </div>

      <ScrollArea className="h-[300px]">
        <div className="divide-y divide-gray-200">
          {mockMessages.map((message) => (
            <div 
              key={message.id} 
              className="p-3 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <div className="h-full w-full bg-[#2B3359] flex items-center justify-center text-white text-sm">
                    {message.avatarInitial}
                  </div>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-[#1F2642] text-sm truncate">{message.athleteName}</p>
                    <span className="text-xs text-gray-500 shrink-0">{message.timestamp}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {message.status === 'sent' && (
                      <Send className="h-3 w-3 text-gray-500 shrink-0" />
                    )}
                    {message.status === 'read' && (
                      <CheckCheck className="h-3 w-3 text-gray-500 shrink-0" />
                    )}
                    {message.status === 'new' && (
                      <Circle className="h-2 w-2 text-[#00D9FF] fill-[#00D9FF] shrink-0" />
                    )}
                    <p className="text-sm text-gray-600 truncate">{message.lastMessage}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
