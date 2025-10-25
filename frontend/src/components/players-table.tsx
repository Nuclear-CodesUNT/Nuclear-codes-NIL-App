import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Edit, Trash2 } from "lucide-react";

const playersData = [
  { id: 1, name: "Marcus Johnson", sport: "Basketball", team: "Lakers", status: "Active", contracts: 3, joinDate: "Jan 15, 2024" },
  { id: 2, name: "Sarah Williams", sport: "Soccer", team: "United FC", status: "Active", contracts: 2, joinDate: "Feb 20, 2024" },
  { id: 3, name: "James Chen", sport: "Football", team: "Eagles", status: "Inactive", contracts: 1, joinDate: "Dec 10, 2023" },
  { id: 4, name: "Emily Rodriguez", sport: "Tennis", team: "Individual", status: "Active", contracts: 5, joinDate: "Mar 5, 2024" },
  { id: 5, name: "David Thompson", sport: "Baseball", team: "Red Sox", status: "Active", contracts: 2, joinDate: "Jan 30, 2024" },
];

export function PlayersTable() {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg text-[#1e2a47]">All Players</h2>
        <Button className="bg-[#2dd4bf] hover:bg-[#2dd4bf]/90 text-[#1e2a47]">
          Add Player
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Sport</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Contracts</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {playersData.map((player) => (
            <TableRow key={player.id}>
              <TableCell>{player.name}</TableCell>
              <TableCell>{player.sport}</TableCell>
              <TableCell>{player.team}</TableCell>
              <TableCell>
                <Badge variant={player.status === "Active" ? "default" : "secondary"} 
                  className={player.status === "Active" ? "bg-[#2dd4bf] text-[#1e2a47]" : ""}>
                  {player.status}
                </Badge>
              </TableCell>
              <TableCell>{player.contracts}</TableCell>
              <TableCell>{player.joinDate}</TableCell>
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
