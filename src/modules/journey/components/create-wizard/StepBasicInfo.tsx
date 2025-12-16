import React from 'react';
import { Input } from '@/components/ui/Input'; // Tận dụng UI có sẵn
import { CreateJourneyRequest, JourneyType } from '../../types';

interface StepBasicInfoProps {
  data: Partial<CreateJourneyRequest>;
  onChange: (updates: Partial<CreateJourneyRequest>) => void;
}

// Danh sách các màu theme có sẵn
const THEME_COLORS = [
  { id: 'DEFAULT', hex: '#6366f1', name: 'Mặc định (Tím)' },
  { id: 'OCEAN', hex: '#06b6d4', name: 'Biển xanh' },
  { id: 'FOREST', hex: '#22c55e', name: 'Rừng rậm' },
  { id: 'SUNSET', hex: '#f97316', name: 'Hoàng hôn' },
  { id: 'ROSE', hex: '#ec4899', name: 'Hoa hồng' },
  { id: 'DARK', hex: '#1f2937', name: 'Bóng đêm' },
];

export const StepBasicInfo: React.FC<StepBasicInfoProps> = ({ data, onChange }) => {
  
  // Kiểm tra xem loại hành trình này có cần ngày tháng không
  // (Ví dụ: Thói quen có thể vô thời hạn, nhưng Challenge thì cần ngày)
  const isDateRequired = data.type === JourneyType.CHALLENGE || data.type === JourneyType.PROJECT;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Đặt tên cho hành trình</h3>
        <p className="text-sm text-gray-500">Hãy chọn một cái tên thật kêu để tạo động lực!</p>
      </div>

      <div className="space-y-4">
        {/* Tên & Mô tả */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên hành trình <span className="text-red-500">*</span></label>
          <Input 
            value={data.name || ''} 
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="VD: 30 Ngày Học Code, Hè Đà Lạt..."
            className="text-lg font-semibold"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
            placeholder="Mục tiêu của hành trình này là gì..."
            value={data.description || ''}
            onChange={(e) => onChange({ description: e.target.value })}
          />
        </div>

        {/* Chọn thời gian */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bắt đầu {isDateRequired && <span className="text-red-500">*</span>}
            </label>
            <Input 
              type="date" 
              value={data.startDate || ''} 
              onChange={(e) => onChange({ startDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kết thúc {isDateRequired && <span className="text-red-500">*</span>}
            </label>
            <Input 
              type="date" 
              value={data.endDate || ''} 
              onChange={(e) => onChange({ endDate: e.target.value })}
            />
          </div>
        </div>

        {/* Chọn Theme màu sắc */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Màu chủ đạo</label>
          <div className="flex flex-wrap gap-3">
            {THEME_COLORS.map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => onChange({ theme: theme.hex })}
                className={`w-10 h-10 rounded-full transition-all duration-200 flex items-center justify-center ${
                  data.theme === theme.hex 
                    ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' 
                    : 'hover:scale-105 opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: theme.hex }}
                title={theme.name}
              >
                {data.theme === theme.hex && (
                  <span className="text-white font-bold text-xs">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};