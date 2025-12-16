import React from 'react';
import { JourneyType } from '../../types';

interface StepChooseTypeProps {
  selectedType: JourneyType | null;
  onSelect: (type: JourneyType) => void;
}

// Định nghĩa dữ liệu hiển thị cho từng loại thẻ
const JOURNEY_OPTIONS = [
  {
    type: JourneyType.HABIT,
    icon: '🔥',
    title: 'Thói quen (Habit)',
    desc: 'Xây dựng kỷ luật, theo dõi chuỗi ngày (Streak) liên tục.',
    color: 'bg-orange-50 border-orange-200 hover:border-orange-500',
  },
  {
    type: JourneyType.ROADMAP,
    icon: '🗺️',
    title: 'Lộ trình (Roadmap)',
    desc: 'Lên kế hoạch với các nhiệm vụ rõ ràng, từng bước một.',
    color: 'bg-blue-50 border-blue-200 hover:border-blue-500',
  },
  {
    type: JourneyType.MEMORIES,
    icon: '📸',
    title: 'Kỷ niệm (Memories)',
    desc: 'Lưu giữ khoảnh khắc vui chơi, du lịch cùng bạn bè.',
    color: 'bg-pink-50 border-pink-200 hover:border-pink-500',
  },
  {
    type: JourneyType.PROJECT,
    icon: '🚀',
    title: 'Dự án (Project)',
    desc: 'Làm việc nhóm, tập trung vào deadline và tiến độ.',
    color: 'bg-purple-50 border-purple-200 hover:border-purple-500',
  },
  {
    type: JourneyType.CHALLENGE,
    icon: '🏆',
    title: 'Thử thách (Challenge)',
    desc: 'Thi đua ngắn hạn, có bảng xếp hạng thành tích.',
    color: 'bg-yellow-50 border-yellow-200 hover:border-yellow-500',
  },
];

export const StepChooseType: React.FC<StepChooseTypeProps> = ({ selectedType, onSelect }) => {
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-800">Bạn muốn bắt đầu hành trình gì?</h3>
        <p className="text-sm text-gray-500">Chọn một loại hình phù hợp nhất với mục tiêu của nhóm bạn.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {JOURNEY_OPTIONS.map((option) => (
          <div
            key={option.type}
            onClick={() => onSelect(option.type)}
            className={`
              cursor-pointer p-4 rounded-xl border-2 transition-all duration-200
              ${option.color}
              ${selectedType === option.type ? 'ring-2 ring-offset-2 ring-indigo-500 border-transparent transform scale-[1.02]' : 'opacity-80 hover:opacity-100'}
            `}
          >
            <div className="flex items-start gap-3">
              <span className="text-3xl">{option.icon}</span>
              <div>
                <h4 className="font-semibold text-gray-900">{option.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{option.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};