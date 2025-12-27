import React from 'react';
import { Input } from '@/components/ui/Input';
import { CreateJourneyRequest } from '../../types';

interface StepBasicInfoProps {
  data: Partial<CreateJourneyRequest>;
  onChange: (updates: Partial<CreateJourneyRequest>) => void;
}

export const StepBasicInfo: React.FC<StepBasicInfoProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Tạo Hành Trình Mới</h3>
        <p className="text-sm text-gray-500">Nhập thông tin cơ bản để bắt đầu ngay.</p>
      </div>

      <div className="space-y-4">
        {/* Tên & Mô tả */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tên hành trình <span className="text-red-500">*</span></label>
          <Input 
            value={data.name || ''} 
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="VD: 30 Ngày Học Code, Chạy bộ..."
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
              Bắt đầu
            </label>
            <Input 
              type="date" 
              value={data.startDate || ''} 
              onChange={(e) => onChange({ startDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kết thúc (Tùy chọn)
            </label>
            <Input 
              type="date" 
              value={data.endDate || ''} 
              onChange={(e) => onChange({ endDate: e.target.value })}
            />
          </div>
        </div>
      </div>
    </div>
  );
};