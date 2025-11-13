import { MessageSquare, Search, Filter, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Textarea } from "./ui/textarea";

interface Message {
  id: number;
  sender: string;
  subject: string;
  preview: string;
  timestamp: string;
  unread: boolean;
  avatar?: string;
  category: "brand" | "athlete";
}

const mockMessages: Message[] = [
  {
    id: 1,
    sender: "Nike Athletics",
    subject: "Partnership Opportunity",
    preview: "We'd love to discuss a partnership opportunity with you. Your social media presence and athletic achievements align perfectly with our brand values...",
    timestamp: "2h ago",
    unread: true,
    category: "brand",
  },
  {
    id: 2,
    sender: "Gatorade",
    subject: "Application Approved",
    preview: "Your application has been approved! Let's schedule a call to discuss the next steps and compensation details. We're excited to work with you...",
    timestamp: "5h ago",
    unread: true,
    category: "brand",
  },
  {
    id: 3,
    sender: "Local Sports Store",
    subject: "New Campaign Available",
    preview: "Thank you for your interest. We have a new campaign launching next month that we think would be perfect for you. The campaign focuses on...",
    timestamp: "1d ago",
    unread: false,
    category: "brand",
  },
  {
    id: 4,
    sender: "Under Armour",
    subject: "Contract Details",
    preview: "Following up on our previous conversation. Please review the attached contract and let us know if you have any questions or concerns...",
    timestamp: "2d ago",
    unread: false,
    category: "brand",
  },
  {
    id: 5,
    sender: "Alex Johnson (Athlete)",
    subject: "Collaboration Inquiry",
    preview: "Hey! I saw your recent deal with Nike and wanted to reach out about potentially collaborating on a joint social media campaign...",
    timestamp: "3d ago",
    unread: true,
    category: "athlete",
  },
];

export function MessagesFeed() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl sm:text-4xl mb-4 text-gray-900">Messages</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Stay connected with brands and manage all your partnership communications in one place
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card>
            <CardContent className="p-6">
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search messages..."
                    className="pl-10 bg-white"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>

              {/* Messages Tabs */}
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="all">All Messages</TabsTrigger>
                  <TabsTrigger value="brands">Brands</TabsTrigger>
                  <TabsTrigger value="athletes">Athletes</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-3">
                  {mockMessages.map((message) => (
                    <MessageCard key={message.id} message={message} />
                  ))}
                </TabsContent>

                <TabsContent value="brands" className="space-y-3">
                  {mockMessages
                    .filter((m) => m.category === "brand")
                    .map((message) => (
                      <MessageCard key={message.id} message={message} />
                    ))}
                </TabsContent>

                <TabsContent value="athletes" className="space-y-3">
                  {mockMessages
                    .filter((m) => m.category === "athlete")
                    .map((message) => (
                      <MessageCard key={message.id} message={message} />
                    ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Message Composer */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h3 className="mb-4 text-gray-900">New Message</h3>
              <div className="space-y-4">
                <Input placeholder="To:" className="bg-white" />
                <Input placeholder="Subject:" className="bg-white" />
                <Textarea
                  placeholder="Write your message..."
                  className="min-h-[120px] bg-white"
                />
                <div className="flex justify-end">
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function MessageCard({ message }: { message: Message }) {
  return (
    <div
      className={`p-4 rounded-lg border transition-all cursor-pointer hover:shadow-md ${
        message.unread
          ? "bg-blue-50 border-blue-200"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-gray-900">{message.sender}</h4>
              {message.unread && (
                <Badge variant="default" className="bg-blue-600">
                  New
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">{message.subject}</p>
          </div>
        </div>
        <span className="text-sm text-gray-500">{message.timestamp}</span>
      </div>
      <p className="text-sm text-gray-600 ml-13 line-clamp-2">
        {message.preview}
      </p>
    </div>
  );
}
