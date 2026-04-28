import React, { useState } from 'react';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import DocuSignViewer from '@/components/DocuSignViewer';

interface ContractStats {
  pending: number;
  active: number;
  closed: number;
}

const contractStats: ContractStats = {
  pending: 5,
  active: 12,
  closed: 28
};

// Added an email field to pass to the viewer
const recentContracts = [
  { id: '1', athlete: 'Marcus Johnson', type: 'Brand Partnership', status: 'pending', value: '$25,000', email: 'marcus@example.com' },
  { id: '2', athlete: 'Sarah Williams', type: 'Social Media', status: 'active', value: '$15,000', email: 'sarah@example.com' },
  { id: '3', athlete: 'Tyler Brown', type: 'Appearance', status: 'active', value: '$8,500', email: 'tyler@example.com' }
];

export default function ContractsOverview() {
  // State to hold the contract currently being signed
  const [signingContract, setSigningContract] = useState<typeof recentContracts[0] | null>(null);

  return (
    <>
      <Card className="bg-white border-gray-200 shadow-sm relative">
        <div className="p-4 border-b border-gray-200 flex items-center gap-2">
          <FileText className="h-5 w-5 text-[#00D9FF]" />
          <h2 className="text-[#1F2642]">Contracts Overview</h2>
        </div>

        {/* Stats Grid */}
        <div className="p-4 grid grid-cols-3 gap-3">
          <div className="bg-[#2B3359] rounded-lg p-3 text-center">
            <div className="flex items-center justify-center mb-2">
              <Clock className="h-5 w-5 text-yellow-400" />
            </div>
            <p className="text-2xl text-white mb-1">{contractStats.pending}</p>
            <p className="text-xs text-gray-300">Pending</p>
          </div>
          
          <div className="bg-[#2B3359] rounded-lg p-3 text-center">
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <p className="text-2xl text-white mb-1">{contractStats.active}</p>
            <p className="text-xs text-gray-300">Active</p>
          </div>
          
          <div className="bg-[#2B3359] rounded-lg p-3 text-center">
            <div className="flex items-center justify-center mb-2">
              <XCircle className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-2xl text-white mb-1">{contractStats.closed}</p>
            <p className="text-xs text-gray-300">Closed</p>
          </div>
        </div>

        {/* Recent Contracts */}
        <div className="border-t border-gray-200">
          <div className="p-3 bg-gray-50">
            <p className="text-xs text-gray-600">Recent Activity</p>
          </div>
          
          <div className="divide-y divide-gray-200">
            {recentContracts.map((contract) => (
              <div key={contract.id} className="p-3 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-[#1F2642] text-sm">{contract.athlete}</p>
                  <Badge 
                    variant="outline" 
                    className={
                      contract.status === 'pending' 
                        ? 'bg-yellow-400/10 text-yellow-600 border-yellow-400' 
                        : 'bg-green-400/10 text-green-600 border-green-400'
                    }
                  >
                    {contract.status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <p className="text-xs text-gray-600">{contract.type}</p>
                    <p className="text-xs text-[#00D9FF]">{contract.value}</p>
                  </div>
                  
                  {/* Action Button: Only show if pending */}
                  {contract.status === 'pending' && (
                    <button 
                      onClick={() => setSigningContract(contract)}
                      className="px-3 py-1.5 bg-[#00D9FF] hover:bg-[#00c2e6] text-[#1F2642] text-xs font-semibold rounded-md transition-colors"
                    >
                      Sign Document
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* DocuSign Modal Overlay */}
      {signingContract && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-lg font-semibold text-[#1F2642]">
                  Signing Session: {signingContract.athlete}
                </h3>
                <p className="text-xs text-gray-500">{signingContract.type} - {signingContract.value}</p>
              </div>
              <button 
                onClick={() => setSigningContract(null)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                aria-label="Close signing session"
              >
                <XCircle className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* DocuSign Viewer Container */}
            <div className="flex-1 overflow-y-auto bg-gray-100">
              <DocuSignViewer 
                signerEmail="kami@example.com" 
                signerName="Kami" 
              />
            </div>
            
          </div>
        </div>
      )}
    </>
  );
}