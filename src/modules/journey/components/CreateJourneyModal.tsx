import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, ChevronLeft, Copy, Plus } from 'lucide-react';
import { StepBasicInfo } from './create-wizard/StepBasicInfo';
import { useCreateJourney } from '../hooks/useCreateJourney';
import { journeyService } from '../services/journey.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateJourneyModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  // 'SELECT': Chọn Tự tạo hay Nhập mã
  // 'CREATE': Form tạo nhanh
  // 'IMPORT': Form nhập mã ID
  const [mode, setMode] = useState<'SELECT' | 'CREATE' | 'IMPORT'>('SELECT');
  const [importId, setImportId] = useState('');
  const [isForking, setIsForking] = useState(false);

  // Hook Create (Đã tối giản - 1 bước)
  const { 
    formData, isLoading, updateFormData, 
    submitForm, resetForm 
  } = useCreateJourney(onSuccess, onClose);

  if (!isOpen) return null;

  const handleClose = () => {
    resetForm();
    setMode('SELECT'); 
    setImportId('');
    onClose();
  };

  // LOGIC FORK
  const handleFork = async () => {
    if (!importId.trim()) return;
    setIsForking(true);
    try {
      await journeyService.forkJourney(importId.trim());
      alert("Sao chép hành trình thành công! Bạn đã là chủ sở hữu mới.");
      if (onSuccess) onSuccess();
      handleClose();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Không tìm thấy hành trình mẫu hoặc lỗi hệ thống.");
    } finally {
      setIsForking(false);
    }
  };

  // --- RENDER 1: Màn hình chọn phương thức ---
  if (mode === 'SELECT') {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95">
        <div className="w-full max-w-md bg-[#18181b] border border-white/10 rounded-3xl p-8 shadow-2xl relative">
          <button onClick={handleClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-white/5 p-2 rounded-full"><X className="w-5 h-5"/></button>
          
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Bắt đầu hành trình</h2>
          <p className="text-zinc-400 text-sm mb-8 text-center">Chọn cách bạn muốn khởi tạo nhóm mới</p>

          <div className="space-y-4">
            <button 
              onClick={() => setMode('CREATE')}
              className="w-full flex items-center gap-5 p-5 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-2xl transition-all group hover:border-blue-500/50"
            >
              <div className="w-14 h-14 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <Plus className="w-7 h-7" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white text-lg">Tạo mới nhanh</h3>
                <p className="text-xs text-zinc-500 mt-1">Tạo tên, đặt mục tiêu và bắt đầu</p>
              </div>
            </button>

            <button 
              onClick={() => setMode('IMPORT')}
              className="w-full flex items-center gap-5 p-5 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-2xl transition-all group hover:border-purple-500/50"
            >
              <div className="w-14 h-14 rounded-full bg-purple-600/10 flex items-center justify-center text-purple-500 group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                <Copy className="w-7 h-7" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white text-lg">Nhập mã mẫu</h3>
                <p className="text-xs text-zinc-500 mt-1">Sao chép từ hành trình có sẵn</p>
              </div>
            </button>
          </div>
        </div>
      </div>, document.body
    );
  }

  // --- RENDER 2: Màn hình nhập mã (Import) ---
  if (mode === 'IMPORT') {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95">
        <div className="w-full max-w-md bg-[#18181b] border border-white/10 rounded-3xl p-8 shadow-2xl relative">
          <button onClick={() => setMode('SELECT')} className="absolute top-4 left-4 text-zinc-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"><ChevronLeft className="w-6 h-6"/></button>
          <button onClick={handleClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors"><X className="w-6 h-6"/></button>
          
          <div className="mt-6 text-center">
            <h2 className="text-xl font-bold text-white mb-2">Nhập mã nguồn</h2>
            <div className="relative mt-6">
                <input 
                autoFocus
                value={importId}
                onChange={(e) => setImportId(e.target.value)}
                placeholder="Dán ID vào đây..."
                className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-white focus:border-purple-500 outline-none text-center"
                />
            </div>
            <button 
              onClick={handleFork}
              disabled={!importId || isForking}
              className="w-full mt-6 bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              {isForking ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sao chép ngay'}
            </button>
          </div>
        </div>
      </div>, document.body
    );
  }

  // --- RENDER 3: Form Tạo Nhanh (1 Bước) ---
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95">
      <div className="w-full max-w-xl bg-[#18181b] border border-white/10 rounded-3xl shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">Tạo Hành Trình Mới</h2>
          <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-full text-zinc-400"><X className="w-6 h-6" /></button>
        </div>

        {/* Body - Chỉ hiển thị StepBasicInfo */}
        <div className="p-6 bg-[#f4f4f5] rounded-b-xl"> 
           <StepBasicInfo data={formData} onChange={updateFormData} />
           
           <div className="mt-8 flex justify-end gap-3">
             <button 
               onClick={() => setMode('SELECT')}
               className="px-6 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-200 transition-colors"
             >
               Hủy
             </button>
             <button 
               onClick={submitForm}
               disabled={isLoading}
               className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg"
             >
               {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Tạo ngay'}
             </button>
           </div>
        </div>
      </div>
    </div>, document.body
  );
};