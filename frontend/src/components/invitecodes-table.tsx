"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { useState, useEffect } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Trash2, Loader2, Copy } from "lucide-react";
import api from "@/lib/api";

interface InviteCode {
  _id: string;
  code: string;
  assignedTo: string;
  usesLeft: number;
  createdAt: string;
}

export function InviteCodesTable() {
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inputs for generating a new code
  const [newAssignedTo, setNewAssignedTo] = useState("");
  const [newUsesLeft, setNewUsesLeft] = useState(1);

  useEffect(() => {
    const fetchCodes = async () => {
      try {
        setLoading(true);
        const response = await api.get("/invite-codes");
        setCodes(response.data.codes);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch invite codes", err);
        setError("Failed to load invite codes from server.");
      } finally {
        setLoading(false);
      }
    };
    fetchCodes();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/invite-codes/${id}`);
      setCodes(codes.filter(c => c._id !== id));
    } catch (err) {
      console.error("Failed to delete invite code", err);
    }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Copied code: ${code}`);
  };

  const handleUpdate = async (id: string, field: "assignedTo" | "usesLeft", value: string | number) => {
    try {
      const updated = await api.patch(`/invite-codes/${id}`, { [field]: value });
      setCodes(prev =>
        prev.map(c => (c._id === id ? { ...c, ...updated.data.code } : c))
      );
    } catch (err) {
      console.error(`Failed to update ${field}`, err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header with inputs */}
      <div className="p-6 border-b border-gray-200 flex flex-wrap justify-between items-center gap-2">
        <h2 className="text-lg text-brand-dark">Generated Invite Codes</h2>

        <div className="flex gap-2 items-center">
          {/* Assigned To input */}
          <input
            type="text"
            placeholder="Assign to (name/email)"
            value={newAssignedTo}
            onChange={(e) => setNewAssignedTo(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          />

          {/* Uses Left input */}
          <input
            type="number"
            min={1}
            value={newUsesLeft}
            onChange={(e) => setNewUsesLeft(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 w-20 text-center"
          />

          {/* Generate New Code button */}
          <Button
            onClick={async () => {
              try {
                const response = await api.post("/invite-codes/generate", {
                  assignedTo: newAssignedTo,
                  usesLeft: newUsesLeft,
                });
                setCodes(prev => [response.data.code, ...prev]);
                setNewAssignedTo("");
                setNewUsesLeft(1);
              } catch (err) {
                console.error("Failed to generate code", err);
              }
            }}
            className="transition transform hover:scale-105 hover:bg-brand-dark text-white bg-brand-teal px-4 py-2 rounded"
          >
            Generate New Code
          </Button>

          {/* Clear All Codes button */}
          <Button
            onClick={async () => {
              if (!confirm("Are you sure you want to delete all invite codes?")) return;
              try {
                await api.delete("/invite-codes/clear-all");
                setCodes([]);
              } catch (err) {
                console.error("Failed to clear all codes", err);
              }
            }}
            className="transition transform hover:scale-105 hover:bg-red-600 text-white bg-red-500 px-4 py-2 rounded"
          >
            Clear All Codes
          </Button>
        </div>
      </div>

      {/* Table */}
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
              <TableHead>Code</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Uses Left</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {codes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No invite codes found.
                </TableCell>
              </TableRow>
            ) : (
              codes.map(code => (
                <TableRow key={code._id}>
                  <TableCell className="font-mono">{code.code}</TableCell>

                  {/* Editable assignedTo */}
                  <TableCell>
                    <input
                      type="text"
                      value={code.assignedTo || ""}
                      onChange={e => handleUpdate(code._id, "assignedTo", e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                  </TableCell>

                  {/* Editable usesLeft */}
                  <TableCell>
                    <input
                      type="number"
                      min={0}
                      value={code.usesLeft}
                      onChange={e => handleUpdate(code._id, "usesLeft", Number(e.target.value))}
                      className={`border rounded px-2 py-1 w-16 text-center ${
                        code.usesLeft === 0
                          ? "border-red-400 text-red-600 bg-red-50"
                          : "border-green-300 text-green-700 bg-green-50"
                      }`}
                    />
                  </TableCell>

                  <TableCell>{new Date(code.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleCopy(code.code)}>
                        <Copy size={16} />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(code._id)}>
                        <Trash2 size={16} />
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