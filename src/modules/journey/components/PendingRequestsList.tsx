import React, { useEffect, useState } from 'react';
import { Check, X, Loader2 } from 'lucide-react';
import { journeyService } from '../services/journey.service';
import { JourneyRequestResponse } from '../types';
import { toast } from 'react-hot-toast';

interface Props {
  journeyId: string;
}

export const PendingRequestsList: React.FC<Props> = ({ journeyId }) => {
  const [requests, setRequests] = useState<JourneyRequestResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const data = await journeyService.getPendingRequests(journeyId);
      setRequests(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [journeyId]);

  const handleAction = async (requestId: string, action: 'approve' | 'reject') => {
    setProcessingId(requestId);
    try {
      if (action === 'approve') {
        await journeyService.approveRequest(requestId);
        toast.success("Đã duyệt thành viên!");
      } else {
        await journeyService.rejectRequest(requestId);
        toast.success("Đã từ chối yêu cầu.");
      }
      // Remove from list
      setRequests(prev => prev.filter(r => r.requestId !== requestId));
    } catch (error) {
      toast.error("Có lỗi xảy ra.");
    } finally {
      setProcessingId(null);
    }
  };

  if (isLoading) return <div className="text-center py-4 text-zinc-500"><Loader2 className="w-5 h-5 animate-spin mx-auto"/></div>;
  
  if (requests.length === 0) return null; // Không hiện gì nếu không có yêu cầu

  return (
    <div className="space-y-3 pt-4 border-t border-white/5">
      <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-2">
        Yêu cầu tham gia <span className="bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded text-[10px]">{requests.length}</span>
      </h3>
      
      <div className="space-y-2">
        {requests.map(req => (
          <div key={req.requestId} className="flex items-center justify-between p-3 bg-zinc-900 rounded-xl border border-white/5">
            <div className="flex items-center gap-3">
              <img src={req.avatarUrl || "/default-avatar.png"} alt={req.fullname} className="w-8 h-8 rounded-full bg-zinc-800 object-cover" />
              <div>
                <p className="text-sm font-medium text-white">{req.fullname}</p>
                <p className="text-xs text-zinc-500">@{req.handle}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleAction(req.requestId, 'reject')}
                disabled={!!processingId}
                className="p-2 hover:bg-red-500/10 text-zinc-400 hover:text-red-500 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleAction(req.requestId, 'approve')}
                disabled={!!processingId}
                className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"
              >
                {processingId === req.requestId ? <Loader2 className="w-4 h-4 animate-spin"/> : <Check className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};