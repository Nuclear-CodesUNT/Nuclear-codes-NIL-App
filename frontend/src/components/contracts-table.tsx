import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Eye, Download } from "lucide-react";

const contractsData = [
  {
    id: 1,
    athlete: "Marcus Johnson",
    company: "Nike",
    startDate: "Jan 1, 2024",
    endDate: "Dec 31, 2024",
    status: "Active"
  },
  {
    id: 2,
    athlete: "Sarah Williams",
    company: "Gatorade",
    startDate: "Feb 1, 2024",
    endDate: "Jan 31, 2025",
    status: "Active"
  },
  {
    id: 3,
    athlete: "Emily Rodriguez",
    company: "Wilson Sports",
    startDate: "Mar 15, 2024",
    endDate: "Mar 14, 2025",
    status: "Active"
  },
  {
    id: 4,
    athlete: "James Chen",
    company: "Under Armour",
    startDate: "Oct 1, 2023",
    endDate: "Sep 30, 2024",
    status: "Expired"
  },
  {
    id: 5,
    athlete: "Marcus Johnson",
    company: "Adidas",
    startDate: "Nov 1, 2024",
    endDate: "Oct 31, 2025",
    status: "Pending"
  },
  {
    id: 6,
    athlete: "David Thompson",
    company: "Rawlings",
    startDate: "Jan 15, 2024",
    endDate: "Jan 14, 2025",
    status: "Active"
  },
  {
    id: 7,
    athlete: "Sarah Williams",
    company: "Red Bull",
    startDate: "Dec 1, 2024",
    endDate: "Nov 30, 2025",
    status: "Under Review"
  },
];

export function ContractsTable() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-[#2dd4bf] text-[#1e2a47]";
      case "Pending":
        return "bg-yellow-500 text-white";
      case "Expired":
        return "bg-gray-500 text-white";
      case "Under Review":
        return "bg-blue-500 text-white";
      default:
        return "";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg text-[#1e2a47]">All Contracts</h2>
        <Button className="bg-[#2dd4bf] hover:bg-[#2dd4bf]/90 text-[#1e2a47]">
          Add Contract
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Athlete</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contractsData.map((contract) => (
            <TableRow key={contract.id}>
              <TableCell>{contract.athlete}</TableCell>
              <TableCell>{contract.company}</TableCell>
              <TableCell>{contract.startDate}</TableCell>
              <TableCell>{contract.endDate}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(contract.status)}>
                  {contract.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye size={16} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download size={16} />
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
