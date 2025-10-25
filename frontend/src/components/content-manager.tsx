import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Edit, Trash2, Eye } from "lucide-react";

const contentData = [
  {
    id: 1,
    title: "Understanding Your NIL Contract",
    category: "Contracts",
    status: "Published",
    views: 1243,
    lastUpdated: "Oct 15, 2024"
  },
  {
    id: 2,
    title: "Tax Basics for Athletes",
    category: "Taxes",
    status: "Published",
    views: 892,
    lastUpdated: "Oct 10, 2024"
  },
  {
    id: 3,
    title: "Building Your Personal Brand",
    category: "Marketing",
    status: "Draft",
    views: 0,
    lastUpdated: "Oct 20, 2024"
  },
  {
    id: 4,
    title: "Investment Strategies for Young Athletes",
    category: "Investing",
    status: "Published",
    views: 2156,
    lastUpdated: "Sep 28, 2024"
  },
  {
    id: 5,
    title: "Managing Social Media as an Athlete",
    category: "Marketing",
    status: "Published",
    views: 1567,
    lastUpdated: "Oct 12, 2024"
  },
  {
    id: 6,
    title: "Financial Planning 101",
    category: "Planning",
    status: "Draft",
    views: 0,
    lastUpdated: "Oct 18, 2024"
  },
];

export function ContentManager() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg text-[#1e2a47]">Financial Literacy Content</h2>
        <Button className="bg-[#2dd4bf] hover:bg-[#2dd4bf]/90 text-[#1e2a47]">
          Create New Content
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {contentData.map((content) => (
          <Card key={content.id} className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="mb-2">{content.title}</h3>
                <div className="flex gap-2 mb-3">
                  <Badge variant="outline" className="text-xs">
                    {content.category}
                  </Badge>
                  <Badge 
                    variant={content.status === "Published" ? "default" : "secondary"}
                    className={content.status === "Published" ? "bg-[#2dd4bf] text-[#1e2a47] text-xs" : "text-xs"}>
                    {content.status}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <Eye size={14} />
                  {content.views} views
                </span>
                <span>Updated: {content.lastUpdated}</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                <Edit size={14} className="mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 size={14} />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
