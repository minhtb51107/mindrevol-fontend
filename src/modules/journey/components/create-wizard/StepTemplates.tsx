import React, { useEffect, useState } from 'react';
import { journeyService } from '../../services/journey.service';
import { JourneyResponse } from '../../types';
import { Loader2, Copy, ArrowRight, LayoutTemplate } from 'lucide-react';

interface Props {
  onSelectTemplate: (templateId: string) => void;
  onSkip: () => void; // Chuyển sang tự tạo
}

export const StepTemplates: React.FC<Props> = ({ onSelectTemplate, onSkip }) => {
  const [templates, setTemplates] = useState<JourneyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        const data = await journeyService.getDiscoveryTemplates();
        setTemplates(data);
      } catch (error) {
        console.error("Lỗi tải templates:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTemplates();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-blue-600/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <LayoutTemplate className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-white">Chọn cách bắt đầu</h3>
        <p className="text-zinc-400 text-sm">Bạn muốn dùng mẫu có sẵn hay tự thiết kế?</p>
      </div>

      <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {/* Option: Tự tạo */}
        <button 
          onClick={onSkip}
          className="flex items-center justify-between p-5 rounded-2xl border-2 border-dashed border-zinc-700 hover:border-blue-500 hover:bg-blue-500/5 transition-all group"
        >
          <div className="text-left">
            <h4 className="font-bold text-white text-lg group-hover:text-blue-400">Tự thiết kế từ đầu</h4>
            <p className="text-sm text-zinc-500 mt-1">Tạo hành trình trống và tự thêm nội dung</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
             <ArrowRight className="w-5 h-5" />
          </div>
        </button>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-zinc-800"></span></div>
          <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest"><span className="bg-[#18181b] px-3 text-zinc-600">Hoặc chọn mẫu</span></div>
        </div>

        {/* List Templates */}
        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-blue-500"/></div>
        ) : templates.length === 0 ? (
           <div className="text-center py-4 text-zinc-600 italic">Hiện chưa có mẫu nào khả dụng.</div>
        ) : (
          templates.map(t => (
            <button 
              key={t.id}
              onClick={() => onSelectTemplate(t.id)}
              className="flex flex-col text-left p-5 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-purple-500 hover:shadow-lg hover:shadow-purple-900/10 transition-all relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: t.theme || '#a855f7' }} />
              <div className="flex justify-between items-start w-full">
                  <div>
                    <h4 className="font-bold text-white text-lg flex items-center gap-2">
                        {t.name}
                    </h4>
                    <p className="text-sm text-zinc-400 mt-1 line-clamp-2">{t.description}</p>
                  </div>
                  <span className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded-md text-zinc-300 uppercase tracking-wider">Mẫu</span>
              </div>
              
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-sm text-purple-400 font-medium opacity-60 group-hover:opacity-100 transition-opacity">
                <Copy className="w-4 h-4" /> Sao chép lộ trình này
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};