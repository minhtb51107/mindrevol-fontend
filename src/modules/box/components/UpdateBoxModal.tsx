import React, { useRef } from 'react';
import { createPortal } from 'react-dom';
import { Loader2, ImagePlus, X, Camera, Package, Settings2 } from 'lucide-react';
import { BoxDetailResponse } from '../types';
import { cn } from '@/lib/utils';
import { useUpdateBox } from '../hooks/useUpdateBox';

interface UpdateBoxModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    boxData: BoxDetailResponse;
}

export const UpdateBoxModal: React.FC<UpdateBoxModalProps> = ({ isOpen, onClose, onSuccess, boxData }) => {
    const avatarFileInputRef = useRef<HTMLInputElement>(null);
    const bgFileInputRef = useRef<HTMLInputElement>(null);

    const {
        name, setName, description, setDescription,
        avatarImage, backgroundImage, isLoading, error,
        handleFileUpload, handleSubmit
    } = useUpdateBox(isOpen, onClose, onSuccess, boxData);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[10000] flex items-end md:items-center justify-center p-0 md:p-6 font-quicksand">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[4px] animate-in fade-in duration-300" onClick={onClose} />
            <div className="relative w-full md:w-[480px] bg-white dark:bg-[#121212] rounded-t-[32px] md:rounded-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] md:shadow-2xl flex flex-col max-h-[92vh] md:max-h-[90vh] animate-in slide-in-from-bottom-1/2 md:slide-in-from-bottom-0 md:zoom-in-95 duration-300 overflow-hidden">
                <div className="w-full flex justify-center pt-3 pb-1 md:hidden shrink-0"><div className="w-12 h-1.5 bg-[#D6CFC7] dark:bg-[#3A3734] rounded-full"></div></div>
                <div className="flex items-center justify-between px-6 md:px-8 py-5 shrink-0 border-b border-[#F4EBE1] dark:border-[#2B2A29]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#F4EBE1] dark:bg-[#2B2A29] rounded-[14px] flex items-center justify-center"><Settings2 className="w-5 h-5 text-[#1A1A1A] dark:text-white" strokeWidth={2.5} /></div>
                        <h2 className="text-[1.4rem] md:text-[1.5rem] font-black text-[#1A1A1A] dark:text-white tracking-tight">Cập nhật Không gian</h2>
                    </div>
                    <button onClick={onClose} className="p-2.5 bg-[#F4EBE1] dark:bg-[#2B2A29] hover:bg-[#E2D9CE] dark:hover:bg-[#3A3734] rounded-[16px] text-[#8A8580] transition-colors active:scale-95"><X size={20} strokeWidth={2.5} /></button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 md:px-8 py-6 space-y-8">
                    {error && <div className="p-4 rounded-[16px] bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-[0.95rem] font-bold text-center">{error}</div>}
                    <div className="relative mb-10">
                        <div onClick={() => bgFileInputRef.current?.click()} className="w-full h-36 md:h-40 rounded-[24px] bg-[#F4EBE1]/50 dark:bg-[#1A1A1A] border border-dashed border-[#D6CFC7] flex flex-col items-center justify-center cursor-pointer hover:bg-[#F4EBE1] transition-all overflow-hidden relative group">
                            {backgroundImage ? <img src={backgroundImage} className="w-full h-full object-cover group-hover:brightness-75 transition-all" alt="Background" /> : <div className="flex flex-col items-center text-[#8A8580]"><Camera size={28} className="mb-2" strokeWidth={2.5} /><span className="text-[0.75rem] font-extrabold uppercase tracking-widest">Đổi ảnh bìa</span></div>}
                            <input type="file" accept="image/*" className="hidden" ref={bgFileInputRef} onChange={(e) => handleFileUpload(e, 'bg')} />
                        </div>
                        <div onClick={() => avatarFileInputRef.current?.click()} className="absolute -bottom-8 left-6 md:left-8 w-24 h-24 rounded-[24px] border-[4px] border-white dark:border-[#121212] bg-[#E2D9CE] flex items-center justify-center cursor-pointer hover:scale-105 transition-transform overflow-hidden group shadow-[0_8px_20px_rgba(0,0,0,0.12)]">
                            {avatarImage ? <img src={avatarImage} className="w-full h-full object-cover group-hover:brightness-75 transition-all" alt="Avatar" /> : (boxData.avatar && !boxData.avatar.includes('/') && !boxData.avatar.startsWith('http') && !boxData.avatar.startsWith('blob:') ? <span className="text-[3rem] leading-none drop-shadow-sm group-hover:opacity-50 transition-opacity">{boxData.avatar === '📦' ? <Package className="text-[#8A8580] w-10 h-10" /> : boxData.avatar}</span> : <ImagePlus size={28} className="text-[#8A8580]" strokeWidth={2.5} />)}
                            <input type="file" accept="image/*" className="hidden" ref={avatarFileInputRef} onChange={(e) => handleFileUpload(e, 'avatar')} />
                        </div>
                    </div>
                    <div className="space-y-5">
                        <div>
                            <label className="text-[#8A8580] dark:text-[#A09D9A] text-[0.75rem] font-extrabold uppercase tracking-widest block mb-2 pl-1">Tên Không gian</label>
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full h-[56px] bg-[#F4EBE1]/50 dark:bg-[#1A1A1A] border border-[#D6CFC7]/50 rounded-[20px] px-5 text-[#1A1A1A] dark:text-white font-bold text-[1.05rem] outline-none shadow-sm" placeholder="VD: Gia đình nhỏ..." />
                        </div>
                        <div>
                            <label className="text-[#8A8580] dark:text-[#A09D9A] text-[0.75rem] font-extrabold uppercase tracking-widest block mb-2 pl-1">Mô tả</label>
                            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full h-24 py-4 bg-[#F4EBE1]/50 dark:bg-[#1A1A1A] border border-[#D6CFC7]/50 rounded-[20px] px-5 text-[#1A1A1A] dark:text-white font-bold text-[1rem] outline-none shadow-sm resize-none" placeholder="Giới thiệu ngắn về Không gian này..." />
                        </div>
                    </div>
                </div>
                <div className="p-6 md:p-8 bg-white dark:bg-[#121212] border-t border-[#F4EBE1] dark:border-[#2B2A29] shrink-0">
                    <button onClick={handleSubmit} disabled={isLoading || !name.trim()} className={cn("w-full h-[60px] rounded-[24px] text-[1.1rem] font-black flex items-center justify-center gap-2 transition-all", (isLoading || !name.trim()) ? "bg-[#E2D9CE] dark:bg-[#2B2A29] text-[#8A8580] cursor-not-allowed" : "bg-[#1A1A1A] dark:bg-white text-white dark:text-[#1A1A1A] hover:-translate-y-1 active:scale-[0.98] shadow-[0_8px_24px_rgba(0,0,0,0.15)]")}>
                        {isLoading && <Loader2 className="w-6 h-6 animate-spin" />} Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>, document.body
    );
};