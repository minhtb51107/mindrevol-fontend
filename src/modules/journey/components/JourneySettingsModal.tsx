// src/modules/journey/components/JourneySettingsModal.tsx
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Loader2, LogOut, Trash2, UserCog, Share2, Copy, Check } from 'lucide-react';
import { JourneyResponse } from '../types';
import { useJourneySettings } from '../hooks/useJourneySettings';
import { useJourneyAction } from '../hooks/useJourneyAction';
import { TransferOwnershipModal } from './TransferOwnershipModal';
import { useAuth } from '@/modules/auth/store/AuthContext';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  journey: JourneyResponse | null;
  onUpdateSuccess: () => void;
}

export const JourneySettingsModal: React.FC<Props> = ({ 
  isOpen, onClose, journey, onUpdateSuccess 
}) => {
  const { user } = useAuth();
  const { settings, isLoading, updateField, handleSave } = useJourneySettings(journey, onUpdateSuccess);
  
  const { deleteJourney, leaveJourney, isProcessing } = useJourneyAction(() => {
    onUpdateSuccess();
    onClose();
  });

  const [showTransferModal, setShowTransferModal] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !journey || !user) return null;

  // Logic phân quyền: So sánh ID (convert sang Number để chắc chắn)
  const isOwner = Number(user.id) === Number(journey.creatorId);

  const handleCopyTemplateId = () => {
    navigator.clipboard.writeText(journey.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return createPortal(
    <>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-full max-w-lg bg-[#18181b] border border-white/10 rounded-2xl flex flex-col max-h-[90vh]">
          
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-white/5">
            <h2 className="text-xl font-bold text-white">Cài đặt Hành trình</h2>
            <button onClick={onClose}><X className="text-zinc-400 hover:text-white" /></button>
          </div>

          <div className="p-6 space-y-6 overflow-y-auto">
            
            {/* 1. THÔNG TIN CƠ BẢN */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Thông tin chung</h3>
              <div>
                <label className="text-sm text-zinc-400">Tên hành trình</label>
                <input 
                  value={settings.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  disabled={!isOwner}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl p-3 text-white mt-1 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                />
              </div>
              
              {isOwner && (
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-xl border border-white/5">
                    <span className="text-white text-sm">Tính chuỗi (Streak)</span>
                    <input 
                      type="checkbox" 
                      checked={settings.hasStreak}
                      onChange={(e) => updateField('hasStreak', e.target.checked)}
                      className="w-5 h-5 accent-blue-600"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-xl border border-white/5">
                    <span className="text-white text-sm">Duyệt thành viên</span>
                    <input 
                      type="checkbox" 
                      checked={settings.requireApproval}
                      onChange={(e) => updateField('requireApproval', e.target.checked)}
                      className="w-5 h-5 accent-blue-600"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2. CHIA SẺ MẪU (VIRAL FEATURES) */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <h3 className="text-xs font-bold text-purple-400 uppercase tracking-wider">Chia sẻ & Viral</h3>
              
              <button 
                onClick={handleCopyTemplateId}
                className="flex items-center justify-between w-full p-4 bg-purple-500/5 hover:bg-purple-500/10 rounded-xl border border-purple-500/20 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-purple-500/10 rounded-lg text-purple-400 group-hover:text-purple-300">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-medium text-sm">Sao chép Mã nguồn</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Chia sẻ để người khác copy hành trình này</p>
                  </div>
                </div>
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-zinc-500 group-hover:text-white" />}
              </button>
            </div>

            {/* 3. VÙNG NGUY HIỂM */}
            <div className="space-y-3 pt-2 border-t border-white/5">
              <h3 className="text-xs font-bold text-red-500 uppercase tracking-wider">Vùng nguy hiểm</h3>
              
              {isOwner ? (
                // OWNER ACTIONS
                <div className="grid gap-3">
                  <button 
                    onClick={() => setShowTransferModal(true)}
                    className="flex items-center justify-between w-full p-4 bg-zinc-900 hover:bg-zinc-800 rounded-xl border border-white/5 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-yellow-500/10 rounded-lg text-yellow-500 group-hover:bg-yellow-500/20">
                        <UserCog className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-white font-medium text-sm">Chuyển quyền sở hữu</p>
                        <p className="text-xs text-zinc-500">Nhường quyền chủ phòng</p>
                      </div>
                    </div>
                  </button>

                  <button 
                    onClick={() => deleteJourney(journey.id)}
                    disabled={isProcessing}
                    className="flex items-center justify-between w-full p-4 bg-red-500/5 hover:bg-red-500/10 rounded-xl border border-red-500/20 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-red-500/10 rounded-lg text-red-500">
                        <Trash2 className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-red-400 font-medium text-sm">Giải tán hành trình</p>
                        <p className="text-xs text-red-500/60">Xóa vĩnh viễn nhóm này</p>
                      </div>
                    </div>
                    {isProcessing && <Loader2 className="w-4 h-4 animate-spin text-red-500"/>}
                  </button>
                </div>
              ) : (
                // MEMBER ACTIONS
                <button 
                  onClick={() => leaveJourney(journey.id)}
                  disabled={isProcessing}
                  className="flex items-center justify-between w-full p-4 bg-zinc-900 hover:bg-red-500/10 rounded-xl border border-white/5 hover:border-red-500/20 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-zinc-800 rounded-lg text-zinc-400 group-hover:text-red-500 group-hover:bg-red-500/10">
                      <LogOut className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="text-white font-medium text-sm group-hover:text-red-400">Rời hành trình</p>
                      <p className="text-xs text-zinc-500">Thoát khỏi nhóm này</p>
                    </div>
                  </div>
                  {isProcessing && <Loader2 className="w-4 h-4 animate-spin text-zinc-400"/>}
                </button>
              )}
            </div>
          </div>

          {/* Footer Save */}
          {isOwner && (
            <div className="p-6 border-t border-white/5 flex justify-end">
              <button 
                onClick={handleSave}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-900/20"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Lưu thay đổi
              </button>
            </div>
          )}
        </div>
      </div>

      <TransferOwnershipModal 
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        journeyId={journey.id}
        currentUserId={Number(user.id)}
        onSuccess={() => {
          setShowTransferModal(false);
          onUpdateSuccess();
          onClose();
        }}
      />
    </>,
    document.body
  );
};