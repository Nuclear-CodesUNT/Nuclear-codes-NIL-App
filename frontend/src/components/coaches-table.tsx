import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Edit, Trash2 } from "lucide-react";

const coachesData = [
  { id: 1, name: "Robert Martinez", sport: "Basketball", team: "Lakers", players: 12, status: "Active", joinDate: "Sep 1, 2023" },
  { id: 2, name: "Linda Harrison", sport: "Soccer", team: "United FC", players: 8, status: "Active", joinDate: "Oct 15, 2023" },
  { id: 3, name: "Michael Lee", sport: "Football", team: "Eagles", players: 15, status: "Active", joinDate: "Aug 20, 2023" },
  { id: 4, name: "Jennifer Brown", sport: "Tennis", team: "Academy", players: 6, status: "Inactive", joinDate: "Jul 10, 2023" },
];

export function CoachesTable() {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg text-[#1e2a47]">All Coaches</h2>
        <Button className="bg-[#2dd4bf] hover:bg-[#2dd4bf]/90 text-[#1e2a47]">
          Add Coach
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Sport</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Players</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coachesData.map((coach) => (
            <TableRow key={coach.id}>
              <TableCell>{coach.name}</TableCell>
              <TableCell>{coach.sport}</TableCell>
              <TableCell>{coach.team}</TableCell>
              <TableCell>{coach.players}</TableCell>
              <TableCell>
                <Badge variant={coach.status === "Active" ? "default" : "secondary"}
                  className={coach.status === "Active" ? "bg-[#2dd4bf] text-[#1e2a47]" : ""}>
                  {coach.status}
                </Badge>
              </TableCell>
              <TableCell>{coach.joinDate}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit size={16} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
