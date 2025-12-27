import React from 'react';
import { Check, X, Loader2, Mail } from 'lucide-react';
import { useJourneyInvitations } from '../hooks/useJourneyInvitations';

interface Props {
  onSuccess: () => void; // Hàm để báo cho cha biết cần reload list hành trình
}

export const InvitationList: React.FC<Props> = ({ onSuccess }) => {
  const { invitations, isLoading, processingId, handleAccept, handleReject } = useJourneyInvitations(onSuccess);

  if (isLoading) return null; // Hoặc skeleton loading nếu muốn
  if (invitations.length === 0) return null;

  return (
    <div className="mb-4 space-y-2 animate-in fade-in slide-in-from-top-4">
      <div className="flex items-center gap-2 px-1">
        <Mail className="w-3.5 h-3.5 text-blue-400" />
        <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider">
          Lời mời tham gia ({invitations.length})
        </h3>
      </div>

      <div className="space-y-2">
        {invitations.map((inv) => (
          <div key={inv.id} className="flex items-center justify-between p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl hover:bg-blue-500/10 transition-colors">
            {/* Info */}
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-white/10">
                {inv.inviterAvatar ? (
                  <img src={inv.inviterAvatar} alt={inv.inviterName} className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-zinc-500">{inv.inviterName.charAt(0)}</span>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {inv.journeyName}
                </p>
                <p className="text-xs text-zinc-400 truncate">
                  Mời bởi <span className="text-zinc-300">{inv.inviterName}</span>
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => handleReject(inv.id)}
                disabled={processingId === inv.id}
                className="p-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50"
                title="Từ chối"
              >
                <X className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleAccept(inv.id)}
                disabled={processingId === inv.id}
                className="p-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors shadow-lg shadow-blue-900/20 disabled:opacity-50"
                title="Đồng ý"
              >
                {processingId === inv.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* Divider */}
      <div className="h-px bg-white/5 my-4" />
    </div>
  );
};