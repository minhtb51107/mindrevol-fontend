import React from 'react';
import { createPortal } from 'react-dom'; 
import { UserProfile } from '../services/user.service';
import { X, Camera, Loader2, User } from 'lucide-react';
import { useEditProfile } from '../hooks/useEditProfile';
import { cn } from '@/lib/utils';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onUpdateSuccess: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, user, onClose, onUpdateSuccess }) => {
  const {
      fullname, setFullname, bio, setBio,
      previewAvatar, fileInputRef, isLoading,
      handleFileChange, handleSubmit
  } = useEditProfile(isOpen, user, onClose, onUpdateSuccess);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-end md:items-center justify-center p-0 md:p-6 font-quicksand">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[4px] animate-in fade-in duration-300" onClick={onClose} />

      <div className="relative w-full md:w-[480px] bg-white dark:bg-[#121212] rounded-t-[32px] md:rounded-[40px] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-1/2 md:slide-in-from-bottom-0 md:zoom-in-95 duration-300">
        
        {/* HEADER ĐỒNG BỘ */}
        <div className="w-full flex justify-center pt-3 pb-1 md:hidden shrink-0">
            <div className="w-12 h-1.5 bg-[#D6CFC7] dark:bg-[#3A3734] rounded-full"></div>
        </div>

        <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-[#F4EBE1] dark:border-[#2B2A29] shrink-0">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F4EBE1] dark:bg-[#2B2A29] rounded-[14px] flex items-center justify-center shadow-sm">
                  <User className="w-5 h-5 text-[#1A1A1A] dark:text-white" strokeWidth={2.5} />
              </div>
              <h2 className="text-[1.4rem] font-black text-[#1A1A1A] dark:text-white tracking-tight">Sửa Hồ sơ</h2>
          </div>
          <button onClick={onClose} className="p-2.5 bg-[#F4EBE1] dark:bg-[#2B2A29] hover:bg-[#E2D9CE] dark:hover:bg-[#3A3734] rounded-[16px] text-[#8A8580] dark:text-[#A09D9A] transition-colors active:scale-95">
              <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar bg-gradient-to-b from-[#F4EBE1]/30 to-white dark:from-[#1A1A1A]/30 dark:to-[#0A0A0A]">
          
          <div className="flex justify-center">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <div className="w-28 h-28 rounded-[32px] overflow-hidden border-[4px] border-white dark:border-[#121212] bg-[#E2D9CE] shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-transform group-hover:scale-105">
                <img src={previewAvatar || user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-black/30 backdrop-blur-sm rounded-[32px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white w-8 h-8" strokeWidth={2} />
              </div>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>

          <div className="space-y-5">
            <div>
              <label className="text-[#8A8580] dark:text-[#A09D9A] text-[0.75rem] font-extrabold uppercase tracking-widest block mb-2 pl-1">Họ và tên</label>
              <input 
                value={fullname} 
                onChange={e => setFullname(e.target.value)}
                className="w-full h-[56px] bg-[#F4EBE1]/50 dark:bg-[#1A1A1A] border border-[#D6CFC7]/50 dark:border-[#2B2A29] rounded-[20px] px-5 font-bold text-[#1A1A1A] dark:text-white placeholder:text-[#A09D9A] focus:border-[#1A1A1A] dark:focus:border-white focus:bg-white dark:focus:bg-[#1A1A1A] outline-none transition-all shadow-sm" 
              />
            </div>
            <div>
              <label className="text-[#8A8580] dark:text-[#A09D9A] text-[0.75rem] font-extrabold uppercase tracking-widest block mb-2 pl-1">Giới thiệu (Bio)</label>
              <textarea 
                value={bio} 
                onChange={e => setBio(e.target.value)}
                rows={3}
                placeholder="Một vài dòng về bản thân..."
                className="w-full bg-[#F4EBE1]/50 dark:bg-[#1A1A1A] border border-[#D6CFC7]/50 dark:border-[#2B2A29] rounded-[20px] p-5 font-bold text-[#1A1A1A] dark:text-white placeholder:text-[#A09D9A] focus:border-[#1A1A1A] dark:focus:border-white focus:bg-white dark:focus:bg-[#1A1A1A] outline-none transition-all shadow-sm resize-none" 
              />
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8 border-t border-[#F4EBE1] dark:border-[#2B2A29] bg-white dark:bg-[#121212] shrink-0">
          <button 
            onClick={handleSubmit} 
            disabled={isLoading || !fullname.trim()}
            className={cn("w-full h-[60px] rounded-[24px] font-black text-[1.1rem] flex items-center justify-center gap-2 transition-all", (isLoading || !fullname.trim()) ? "bg-[#E2D9CE] dark:bg-[#2B2A29] text-[#8A8580] dark:text-[#A09D9A] cursor-not-allowed" : "bg-[#1A1A1A] dark:bg-white text-white dark:text-[#1A1A1A] hover:-translate-y-1 active:scale-[0.98] shadow-[0_8px_24px_rgba(0,0,0,0.15)]")}
          >
            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />} Lưu thay đổi
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};