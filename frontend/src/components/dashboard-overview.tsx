import { Card } from "./ui/card";
import { Users, FileText, BookOpen } from "lucide-react";

export function DashboardOverview() {
  const stats = [
    {
      label: "Total Players",
      value: "127",
      change: "+12%",
      icon: Users,
      color: "bg-blue-500"
    },
    {
      label: "Active Contracts",
      value: "43",
      change: "+8%",
      icon: FileText,
      color: "bg-[#2dd4bf]"
    },
    {
      label: "Content Articles",
      value: "68",
      change: "+4%",
      icon: BookOpen,
      color: "bg-purple-500"
    },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="text-white" size={24} />
                </div>
                <span className="text-green-600 text-sm">{stat.change}</span>
              </div>
              <div>
                <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
                <p className="text-[#1e2a47] text-2xl">{stat.value}</p>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="mb-4 text-[#1e2a47]">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: "New player registered", name: "Marcus Johnson", time: "2 hours ago" },
              { action: "Contract signed", name: "Sarah Williams - Nike", time: "5 hours ago" },
              { action: "Content published", name: "Tax Basics for Athletes", time: "1 day ago" },
              { action: "Contract expired", name: "James Chen - Under Armour", time: "2 days ago" },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                <div className="w-2 h-2 rounded-full bg-[#2dd4bf] mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm">{activity.action}</p>
                  <p className="text-sm text-gray-600">{activity.name}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-[#1e2a47]">Upcoming Contract Renewals</h3>
          <div className="space-y-4">
            {[
              { athlete: "Emily Rodriguez", company: "Wilson Sports", expires: "Mar 14, 2025" },
              { athlete: "David Thompson", company: "Rawlings", expires: "Jan 14, 2025" },
              { athlete: "Sarah Williams", company: "Gatorade", expires: "Jan 31, 2025" },
              { athlete: "Marcus Johnson", company: "Nike", expires: "Dec 31, 2024" },
            ].map((contract, index) => (
              <div key={index} className="flex items-center justify-between pb-3 border-b last:border-b-0">
                <div>
                  <p className="text-sm">{contract.athlete}</p>
                  <p className="text-sm text-gray-600">{contract.company}</p>
                </div>
                <span className="text-xs text-gray-500">{contract.expires}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
