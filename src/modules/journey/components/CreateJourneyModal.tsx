// src/modules/journey/components/CreateJourneyModal.tsx
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Loader2, ChevronLeft, Check, Copy, PenTool } from 'lucide-react';
import { StepChooseType } from './create-wizard/StepChooseType';
import { StepBasicInfo } from './create-wizard/StepBasicInfo';
import { StepSettings } from './create-wizard/StepSettings';
import { StepRoadmap } from './create-wizard/StepRoadmap'; // Import bước Roadmap
import { useCreateJourney } from '../hooks/useCreateJourney';
import { journeyService } from '../services/journey.service';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const STEPS_LABELS = ['TYPE', 'INFO', 'SETTINGS', 'ROADMAP'];

export const CreateJourneyModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  // --- STATE QUẢN LÝ LUỒNG ---
  // 'SELECT': Chọn Tự tạo hay Nhập mã
  // 'WIZARD': Form đi từng bước
  // 'IMPORT': Form nhập mã ID
  const [mode, setMode] = useState<'SELECT' | 'WIZARD' | 'IMPORT'>('SELECT');
  const [importId, setImportId] = useState('');
  const [isForking, setIsForking] = useState(false);

  // Hook Wizard (Chỉ dùng khi mode = WIZARD)
  const { 
    currentStepIdx, formData, isLoading, updateFormData, 
    nextStep, prevStep, resetForm 
  } = useCreateJourney(onSuccess, onClose);

  if (!isOpen) return null;

  const handleClose = () => {
    resetForm();
    setMode('SELECT'); 
    setImportId('');
    onClose();
  };

  // LOGIC FORK (Sao chép hành trình)
  const handleFork = async () => {
    if (!importId.trim()) return;
    setIsForking(true);
    try {
      await journeyService.forkJourney(importId.trim());
      // Thành công
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

  // --- RENDER 1: Màn hình chọn phương thức (Bước 0) ---
  if (mode === 'SELECT') {
    return createPortal(
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95">
        <div className="w-full max-w-md bg-[#18181b] border border-white/10 rounded-3xl p-8 shadow-2xl relative">
          <button onClick={handleClose} className="absolute top-4 right-4 text-zinc-400 hover:text-white bg-white/5 p-2 rounded-full"><X className="w-5 h-5"/></button>
          
          <h2 className="text-2xl font-bold text-white mb-2 text-center">Bắt đầu hành trình</h2>
          <p className="text-zinc-400 text-sm mb-8 text-center">Chọn cách bạn muốn khởi tạo nhóm mới</p>

          <div className="space-y-4">
            <button 
              onClick={() => setMode('WIZARD')}
              className="w-full flex items-center gap-5 p-5 bg-zinc-900 hover:bg-zinc-800 border border-white/10 rounded-2xl transition-all group hover:border-blue-500/50"
            >
              <div className="w-14 h-14 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-500 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                <PenTool className="w-7 h-7" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-white text-lg">Tự thiết kế</h3>
                <p className="text-xs text-zinc-500 mt-1">Tạo mới từ đầu theo ý bạn</p>
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
            <div className="w-16 h-16 bg-purple-600/20 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Copy className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Nhập mã nguồn</h2>
            <p className="text-zinc-400 text-sm mb-6">Dán mã ID hành trình bạn muốn sao chép</p>

            <div className="relative">
                <input 
                autoFocus
                value={importId}
                onChange={(e) => setImportId(e.target.value)}
                placeholder="Dán ID vào đây..."
                className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 outline-none font-mono text-center text-lg placeholder:text-zinc-700"
                />
            </div>
            
            <p className="text-xs text-zinc-600 mt-4 bg-zinc-900/50 p-3 rounded-lg border border-white/5">
              💡 Mẹo: Bạn có thể lấy mã này từ nút <strong>"Chia sẻ mẫu"</strong> trong cài đặt hành trình của bạn bè.
            </p>

            <button 
              onClick={handleFork}
              disabled={!importId || isForking}
              className="w-full mt-6 bg-purple-600 hover:bg-purple-500 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-purple-900/20"
            >
              {isForking ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sao chép ngay'}
            </button>
          </div>
        </div>
      </div>, document.body
    );
  }

  // --- RENDER 3: Wizard Tự thiết kế (Logic cũ + Roadmap) ---
  const renderWizardContent = () => {
    switch (currentStepIdx) {
      case 0: return <StepChooseType selectedType={formData.type} onSelect={(type) => updateFormData({ type })} />;
      case 1: return <StepBasicInfo data={formData} onChange={updateFormData} />;
      case 2: return <StepSettings data={formData} onChange={updateFormData} />;
      case 3: return <StepRoadmap data={formData} onChange={updateFormData} />; // Bước 4 Mới
      default: return null;
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in zoom-in-95">
      <div className="w-full max-w-2xl bg-[#18181b] border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-[#18181b] rounded-t-3xl">
          <div>
            <h2 className="text-xl font-bold text-white">Thiết kế Hành Trình</h2>
            <div className="flex gap-1 mt-2">
              {STEPS_LABELS.map((_, idx) => (
                <div key={idx} className={`h-1 w-8 rounded-full transition-colors ${idx <= currentStepIdx ? 'bg-blue-500' : 'bg-zinc-800'}`} />
              ))}
            </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-full text-zinc-400"><X className="w-6 h-6" /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#18181b]"> 
          {renderWizardContent()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 flex justify-between bg-[#18181b] rounded-b-3xl">
          <button 
            onClick={currentStepIdx === 0 ? () => setMode('SELECT') : prevStep}
            disabled={isLoading}
            className="px-6 py-3 rounded-xl font-medium text-zinc-300 hover:bg-white/10 flex items-center gap-2 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" /> {currentStepIdx === 0 ? 'Quay lại' : 'Lùi bước'}
          </button>

          <button 
            onClick={nextStep}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {currentStepIdx === STEPS_LABELS.length - 1 ? (<>Hoàn thành <Check className="w-4 h-4" /></>) : 'Tiếp tục'}
          </button>
        </div>
      </div>
    </div>, document.body
  );
};