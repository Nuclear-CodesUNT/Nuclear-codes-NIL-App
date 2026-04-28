"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Button } from "./ui/button";
import { Eye, Download, Loader2, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import api from "@/lib/api";

interface ContractUser {
  _id: string;
  name: string;
  email: string;
  role: string;
}

type ContractStatus = "Pending" | "Reviewing" | "Approved" | "Rejected";

interface Contract {
  _id: string;
  user: ContractUser;
  fileName: string;
  fileUrl: string;
  fileSize?: number;
  status: ContractStatus;
  submittedAt: string;
}

const STATUS_OPTIONS: { value: ContractStatus; label: string }[] = [
  { value: "Pending", label: "Pending" },
  { value: "Reviewing", label: "Reviewing" },
  { value: "Approved", label: "Approved" },
  { value: "Rejected", label: "Rejected" },
];

export function ContractsTable() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [viewerContract, setViewerContract] = useState<Contract | null>(null);
  const [viewerUrl, setViewerUrl] = useState<string | null>(null);
  const [viewerLoading, setViewerLoading] = useState(false);

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/contracts");
        setContracts(response.data.contracts);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch contracts:", err);
        setError("Failed to load contracts");
      } finally {
        setLoading(false);
      }
    };

    fetchContracts();
  }, []);

  const getStatusColor = (status: ContractStatus) => {
    switch (status) {
      case "Approved":
        return "text-green-500 border-green-500";
      case "Pending":
        return "text-yellow-600 border-yellow-500";
      case "Rejected":
        return "text-red-500 border-red-500";
      case "Reviewing":
        return "text-blue-500 border-blue-500";
      default:
        return "";
    }
  };

  const handleStatusChange = async (contractId: string, newStatus: ContractStatus) => {
    try {
      setUpdatingStatus(contractId);
      await api.patch(`/contracts/${contractId}/status`, { status: newStatus });
      
      // Update local state
      setContracts((prev) =>
        prev.map((contract) =>
          contract._id === contractId ? { ...contract, status: newStatus } : contract
        )
      );
    } catch (err) {
      console.error("Failed to update status:", err);
      // Optionally show error to user
    } finally {
      setUpdatingStatus(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const fetchSignedUrl = async (contractId: string): Promise<string | null> => {
    try {
      const response = await api.get(`/contracts/${contractId}/view`);
      return response.data.url;
    } catch (err) {
      console.error("Failed to get viewing URL:", err);
      return null;
    }
  };

  const handleView = async (contract: Contract) => {
    setViewerContract(contract);
    setViewerLoading(true);
    setViewerUrl(null);

    const url = await fetchSignedUrl(contract._id);
    setViewerUrl(url);
    setViewerLoading(false);
  };

  const handleCloseViewer = () => {
    setViewerContract(null);
    setViewerUrl(null);
  };

  const handleDownload = async (contract: Contract) => {
    const url = await fetchSignedUrl(contract._id);
    if (url) {
      window.open(url, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg text-brand-dark">All Contracts</h2>
        </div>
        <div className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
          <span className="ml-2 text-gray-500">Loading contracts...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg text-brand-dark">All Contracts</h2>
        </div>
        <div className="flex items-center justify-center p-12">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg text-brand-dark">All Contracts</h2>
        <span className="text-sm text-gray-500">
          {contracts.length} {contracts.length === 1 ? "contract" : "contracts"}
        </span>
      </div>

      {contracts.length === 0 ? (
        <div className="flex items-center justify-center p-12">
          <p className="text-gray-500">No contracts submitted yet</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Athlete</TableHead>
              <TableHead>File Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract._id}>
                <TableCell className="font-medium">
                  {contract.user?.name || "Unknown"}
                </TableCell>
                <TableCell className="max-w-50 truncate" title={contract.fileName}>
                  {contract.fileName}
                </TableCell>
                <TableCell className="text-gray-500">
                  {formatFileSize(contract.fileSize)}
                </TableCell>
                <TableCell>{formatDate(contract.submittedAt)}</TableCell>
                <TableCell>
                  <Select
                    value={contract.status}
                    onValueChange={(value: ContractStatus) =>
                      handleStatusChange(contract._id, value)
                    }
                    disabled={updatingStatus === contract._id}
                  >
                    <SelectTrigger
                      size="sm"
                      className={`w-32.5 ${getStatusColor(contract.status)}`}
                    >
                      {updatingStatus === contract._id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <SelectValue />
                      )}
                    </SelectTrigger>
                    <SelectContent 
                      position="popper" 
                      sideOffset={5} 
                      className="z-9999 bg-white shadow-lg border border-gray-200"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <SelectItem 
                          key={option.value} 
                          value={option.value}
                          className="hover:bg-gray-100 cursor-pointer"
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleView(contract)}
                      title="View file"
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(contract)}
                      title="Download file"
                    >
                      <Download size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Contract Viewer Panel — slides in from the right as an overlay */}
      {viewerContract && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop — click to close */}
          <div className="flex-1 bg-black/40" onClick={handleCloseViewer} />

          {/* Panel */}
          <div className="w-full max-w-3xl bg-white shadow-xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {viewerContract.fileName}
                </h3>
                <p className="text-sm text-gray-500">
                  {viewerContract.user?.name || "Unknown"} &middot; {formatDate(viewerContract.submittedAt)}
                </p>
              </div>
              <button
                onClick={handleCloseViewer}
                className="ml-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 bg-gray-100">
              {viewerLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
                  <span className="ml-2 text-gray-500">Loading document...</span>
                </div>
              ) : viewerUrl ? (
                <iframe
                  src={viewerUrl}
                  className="w-full h-full border-0"
                  title={viewerContract.fileName}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-red-500">
                  Failed to load document. Please try again.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
