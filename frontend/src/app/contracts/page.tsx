"use client";

import { useState } from 'react';
import { Upload, FileText, X, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface SubmittedFile {
  id: string;
  name: string;
  size: number;
  status: 'Pending' | 'Reviewing' | 'Approved';
  submittedAt: Date;
}

export default function ContractUploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // State for the side table
  const [submittedFiles, setSubmittedFiles] = useState<SubmittedFile[]>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      handleNewFile(droppedFile);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleNewFile(e.target.files[0]);
    }
  };

  const handleNewFile = async (selectedFile: File) => {
    setFile(selectedFile);
    setUploadStatus('idle'); // Reset status for new file
    displayFile(selectedFile);
    await uploadFile(selectedFile);
  };

  const uploadFile = async (fileToUpload: File) => {
    setUploadStatus('uploading');
    const formData = new FormData();
    formData.append("file", fileToUpload);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL || ''}/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (!process.env.NEXT_PUBLIC_BACKEND_API_URL) {
         await new Promise(resolve => setTimeout(resolve, 1500)); // Fake delay
         setUploadStatus('success');
         return;
      }

      const result = await response.json();
      if (result.success) {
        setUploadStatus('success');
      } else {
        setUploadStatus('error');
      }
    } catch (error) {
      console.error("Upload error:", error);
      // Fallback for demo if fetch fails (e.g. no backend running)
      setUploadStatus('error'); 
    }
  };

  const displayFile = (fileToUpload: File) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(fileToUpload);
    setPreviewUrl(url);
  };

  const removeFile = () => {
    setFile(null);
    setUploadStatus('idle');
    if (previewUrl){
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmitContract = () => {
    if (!file) return;

    const newSubmission: SubmittedFile = {
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      status: 'Pending',
      submittedAt: new Date(),
    };

    setSubmittedFiles(prev => [newSubmission, ...prev]);
    
    // Reset form after submission
    removeFile();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: Upload & Preview Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            {!file ? (
              // Empty State - RESTORED ORIGINAL STYLING
              <div
                className={`relative border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
                  isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-red-500 rounded-lg flex items-center justify-center">
                        <FileText className="w-12 h-12 text-white" />
                      </div>
                      <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center border-4 border-gray-50">
                        <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                          <path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3" stroke="white" strokeWidth="2" fill="none"/>
                        </svg>
                      </div>
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Upload Contract
                </h2>

                <p className="text-gray-600 mb-8">
                  Drag and drop a Microsoft Word, Excel, PowerPoint or image file to upload your contract.
                </p>

                <label className="inline-block relative z-10">
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".pdf,.doc,.docx"
                  />
                  <div className="flex items-center gap-2 bg-slate-900 hover:bg-gray-800 text-white px-6 py-3 rounded-lg cursor-pointer transition-colors">
                    <Upload className="w-5 h-5" />
                    <span className="font-semibold">Select a file</span>
                  </div>
                </label>
              </div>
            ) : (
              // File Selected State
              <div className="space-y-6">
                {/* Header with status */}
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Review Contract</h3>
                        <p className="text-sm text-gray-500">Review the file before final submission.</p>
                    </div>
                    <button
                        onClick={removeFile}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Cancel upload"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Progress / Status Bar */}
                <div className={`p-4 rounded-lg border ${
                    uploadStatus === 'error' ? 'bg-red-50 border-red-200' : 
                    uploadStatus === 'success' ? 'bg-green-50 border-green-200' : 
                    'bg-blue-50 border-blue-100'
                }`}>
                    <div className="flex items-center gap-3">
                        {uploadStatus === 'uploading' && <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />}
                        {uploadStatus === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                        {uploadStatus === 'error' && <AlertCircle className="w-5 h-5 text-red-600" />}
                        
                        <div className="flex-1">
                            <p className={`font-medium ${
                                uploadStatus === 'error' ? 'text-red-900' : 
                                uploadStatus === 'success' ? 'text-green-900' : 
                                'text-blue-900'
                            }`}>
                                {uploadStatus === 'uploading' && 'Uploading to server...'}
                                {uploadStatus === 'success' && 'Upload complete. Ready to submit.'}
                                {uploadStatus === 'error' && 'Upload failed. Please try again.'}
                            </p>
                            {uploadStatus === 'uploading' && (
                                <div className="w-full bg-blue-200 rounded-full h-1.5 mt-2">
                                    <div className="bg-blue-600 h-1.5 rounded-full animate-[pulse_1s_ease-in-out_infinite]" style={{ width: '80%' }}></div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Preview Area */}
                {previewUrl && (
                  <div className={`bg-gray-100 border border-gray-200 rounded-lg overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 flex flex-col bg-gray-900 p-4' : 'relative'}`}>
                    {isFullscreen && (
                        <div className="flex justify-end mb-4">
                             <button onClick={() => setIsFullscreen(false)} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg">Close Fullscreen</button>
                        </div>
                    )}
                    
                    <div className="bg-white border-b px-4 py-2 flex justify-between items-center">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">File Preview</span>
                        <button 
                            onClick={() => setIsFullscreen(!isFullscreen)}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                        >
                            {isFullscreen ? 'Exit Fullscreen' : 'Expand View'}
                        </button>
                    </div>

                    <div className={`bg-gray-50 flex items-center justify-center ${isFullscreen ? 'flex-1' : 'h-[500px]'}`}>
                        {file.type === 'application/pdf' ? (
                        <embed
                            src={previewUrl}
                            type="application/pdf"
                            className="w-full h-full"
                        />
                        ) : file.type.startsWith('image/') ? (
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain"
                        />
                        ) : (
                        <div className="text-center p-8">
                            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-900 font-medium">No preview available</p>
                            <p className="text-gray-500 text-sm mb-4">This file type cannot be previewed in the browser.</p>
                            <a href={previewUrl} download={file.name} className="text-blue-600 hover:underline">Download file</a>
                        </div>
                        )}
                    </div>
                  </div>
                )}

                {/* Action Footer */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                        onClick={removeFile}
                        className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmitContract}
                        disabled={uploadStatus !== 'success'}
                        className={`px-6 py-2 rounded-lg font-medium shadow-sm transition-all flex items-center gap-2 ${
                            uploadStatus === 'success' 
                                ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md' 
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        <CheckCircle className="w-4 h-4" />
                        Confirm Submission
                    </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Submitted Contracts Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-8">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                Submitted Contracts
              </h3>
            </div>
            
            <div className="divide-y divide-gray-100 max-h-[calc(100vh-200px)] overflow-y-auto">
                {submittedFiles.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FileText className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-sm">No contracts submitted yet.</p>
                    </div>
                ) : (
                    submittedFiles.map((contract) => (
                        <div key={contract.id} className="p-4 hover:bg-gray-50 transition-colors group">
                            <div className="flex items-start justify-between mb-1">
                                <div className="font-medium text-gray-900 truncate pr-4" title={contract.name}>
                                    {contract.name}
                                </div>
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                    {contract.status}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                                <span>{(contract.size / 1024 / 1024).toFixed(2)} MB</span>
                                <span>{contract.submittedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
            
            {submittedFiles.length > 0 && (
                <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-xs text-center text-gray-500">
                    {submittedFiles.length} file{submittedFiles.length !== 1 && 's'} submitted this session
                </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}