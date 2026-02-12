import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
// If it's in a subfolder named 'components'
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

const recentContracts = [
  { id: '1', athlete: 'Marcus Johnson', type: 'Brand Partnership', status: 'pending', value: '$25,000' },
  { id: '2', athlete: 'Sarah Williams', type: 'Social Media', status: 'active', value: '$15,000' },
  { id: '3', athlete: 'Tyler Brown', type: 'Appearance', status: 'active', value: '$8,500' }
];

export default function ContractsOverview() {
  return (
    <Card className="bg-white border-gray-200 shadow-sm">
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
            <div key={contract.id} className="p-3 hover:bg-gray-50 cursor-pointer transition-colors">
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
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-600">{contract.type}</p>
                <p className="text-xs text-[#00D9FF]">{contract.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
