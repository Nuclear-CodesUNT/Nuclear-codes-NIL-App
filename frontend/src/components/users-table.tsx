import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  banned?: boolean;
  bannedReason?: string;
  createdAt: string;
}

export function UsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await api.get("/users");
        setUsers(response.data.users);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch users", err);
        setError("Failed to load users from server.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (userId: string) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      setActionLoading(userId);
      await api.delete(`/users/${userId}`);
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    } finally {
      setActionLoading(null);
    }
  };

  // Ban or unban user
  const handleBanToggle = async (user: User) => {
    const action = user.banned ? "unban" : "ban";
    let reason: string | undefined = undefined;

    if (!user.banned) {
      reason = prompt("Reason for ban (optional):") || undefined;
      if (!window.confirm("Are you sure you want to ban this user?")) return;
    } else {
      if (!window.confirm("Are you sure you want to unban this user?")) return;
    }

    try {
      setActionLoading(user._id);
      await api.post(`/users/${user._id}/${action}`, { reason });
      setUsers(prev =>
        prev.map(u =>
          u._id === user._id ? { ...u, banned: !u.banned, bannedReason: reason } : u
        )
      );
    } catch (err) {
      console.error(err);
      alert(`Failed to ${action} user`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg text-brand-dark">All Users</h2>
      </div>

      {loading ? (
        <div className="p-12 flex justify-center items-center">
          <Loader2 className="animate-spin text-brand-teal" size={32} />
        </div>
      ) : error ? (
        <div className="p-12 text-center text-red-500">{error}</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Join Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              users.map(user => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="capitalize bg-brand-teal/10 text-brand-dark border-brand-teal"
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.banned ? "destructive" : "secondary"}
                      className="capitalize px-2 py-1"
                    >
                      {user.banned ? "Banned" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {/* Ban / Unban Button */}
                      <Button
                        variant="secondary"
                        size="sm"
                        className={`px-3 py-1 ${
                          user.banned ? "bg-green-600 text-white hover:bg-green-700" : "bg-yellow-400 text-black hover:bg-yellow-500"
                        }`}
                        onClick={() => handleBanToggle(user)}
                        disabled={actionLoading === user._id}
                      >
                        {actionLoading === user._id
                          ? <Loader2 className="animate-spin" size={16} />
                          : user.banned
                            ? "Unban"
                            : "Ban"}
                      </Button>

                      {/* Delete Button */}
                      <Button
                        variant="destructive"
                        size="sm"
                        className="px-3 py-1 bg-red-600 text-white hover:bg-red-700"
                        onClick={() => handleDelete(user._id)}
                        disabled={actionLoading === user._id}
                      >
                        {actionLoading === user._id
                          ? <Loader2 className="animate-spin" size={16} />
                          : "Delete"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}