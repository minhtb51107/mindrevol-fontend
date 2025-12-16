import React from 'react';
import { CreateJourneyRequest, InteractionType, JourneyVisibility } from '../../types';

interface StepSettingsProps {
  data: Partial<CreateJourneyRequest>;
  onChange: (updates: Partial<CreateJourneyRequest>) => void;
}

export const StepSettings: React.FC<StepSettingsProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Thiết lập không gian</h3>
        <p className="text-sm text-gray-500">Quyết định xem hành trình này sẽ hoạt động thế nào.</p>
      </div>

      {/* 1. Quyền Riêng Tư */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Ai được tham gia?</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className={`
            flex items-center p-3 border rounded-lg cursor-pointer transition-all
            ${data.visibility === JourneyVisibility.PUBLIC ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' : 'hover:bg-gray-50'}
          `}>
            <input 
              type="radio" 
              name="visibility" 
              className="sr-only"
              checked={data.visibility === JourneyVisibility.PUBLIC}
              onChange={() => onChange({ visibility: JourneyVisibility.PUBLIC })}
            />
            <span className="text-2xl mr-3">🌍</span>
            <div>
              <div className="font-semibold text-gray-900">Công khai (Public)</div>
              <div className="text-xs text-gray-500">Bất kỳ ai cũng có thể tìm thấy và tham gia.</div>
            </div>
          </label>

          <label className={`
            flex items-center p-3 border rounded-lg cursor-pointer transition-all
            ${data.visibility === JourneyVisibility.PRIVATE ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' : 'hover:bg-gray-50'}
          `}>
            <input 
              type="radio" 
              name="visibility" 
              className="sr-only"
              checked={data.visibility === JourneyVisibility.PRIVATE}
              onChange={() => onChange({ visibility: JourneyVisibility.PRIVATE })}
            />
            <span className="text-2xl mr-3">🔒</span>
            <div>
              <div className="font-semibold text-gray-900">Riêng tư (Private)</div>
              <div className="text-xs text-gray-500">Chỉ những người có Link mời mới được vào.</div>
            </div>
          </label>
        </div>
      </div>

      {/* 2. Cách Tương Tác */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Phong cách tương tác</h4>
        <div className="space-y-3">
          
          {/* Kiểu Locket */}
          <label className={`
            flex items-center p-3 border rounded-lg cursor-pointer transition-all
            ${data.interactionType === InteractionType.PRIVATE_REPLY ? 'bg-pink-50 border-pink-500 ring-1 ring-pink-500' : 'hover:bg-gray-50'}
          `}>
             <input 
              type="radio" 
              name="interaction" 
              className="sr-only"
              checked={data.interactionType === InteractionType.PRIVATE_REPLY}
              onChange={() => onChange({ interactionType: InteractionType.PRIVATE_REPLY })}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">💌</span>
                <span className="font-semibold text-gray-900">Nhắn tin riêng (Kiểu Locket)</span>
              </div>
              <p className="text-xs text-gray-600 mt-1 pl-8">Reply ảnh sẽ gửi vào tin nhắn riêng 1-1. Giữ sự riêng tư tối đa.</p>
            </div>
          </label>

          {/* Kiểu Facebook/Group */}
          <label className={`
            flex items-center p-3 border rounded-lg cursor-pointer transition-all
            ${data.interactionType === InteractionType.GROUP_DISCUSS ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500' : 'hover:bg-gray-50'}
          `}>
             <input 
              type="radio" 
              name="interaction" 
              className="sr-only"
              checked={data.interactionType === InteractionType.GROUP_DISCUSS}
              onChange={() => onChange({ interactionType: InteractionType.GROUP_DISCUSS })}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">💬</span>
                <span className="font-semibold text-gray-900">Thảo luận nhóm (Kiểu Group)</span>
              </div>
              <p className="text-xs text-gray-600 mt-1 pl-8">Bình luận công khai dưới bài đăng. Phù hợp cho lớp học, dự án.</p>
            </div>
          </label>

          {/* Kiểu Thông báo */}
          <label className={`
            flex items-center p-3 border rounded-lg cursor-pointer transition-all
            ${data.interactionType === InteractionType.RESTRICTED ? 'bg-gray-100 border-gray-400 ring-1 ring-gray-400' : 'hover:bg-gray-50'}
          `}>
             <input 
              type="radio" 
              name="interaction" 
              className="sr-only"
              checked={data.interactionType === InteractionType.RESTRICTED}
              onChange={() => onChange({ interactionType: InteractionType.RESTRICTED })}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">🔇</span>
                <span className="font-semibold text-gray-900">Hạn chế (Chỉ Reaction)</span>
              </div>
              <p className="text-xs text-gray-600 mt-1 pl-8">Chỉ cho phép thả tim/reaction. Không được bình luận.</p>
            </div>
          </label>

        </div>
      </div>
    </div>
  );
};