import React, { useState } from 'react';
import { Plus, Trash2, Calendar, Flag } from 'lucide-react';
import { CreateJourneyRequest } from '../../types';

interface Props {
  data: CreateJourneyRequest;
  onChange: (data: Partial<CreateJourneyRequest>) => void;
}

export const StepRoadmap: React.FC<Props> = ({ data, onChange }) => {
  // Local state để quản lý list task tạm thời
  const [tasks, setTasks] = useState(data.roadmapTasks || []);

  const addTask = () => {
    const nextDay = tasks.length + 1;
    const newTask = { dayNo: nextDay, title: '', description: '' };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    onChange({ roadmapTasks: updatedTasks });
  };

  const removeTask = (index: number) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    // Re-index lại ngày (để đảm bảo thứ tự 1, 2, 3...)
    const reindexed = newTasks.map((t, i) => ({ ...t, dayNo: i + 1 }));
    setTasks(reindexed);
    onChange({ roadmapTasks: reindexed });
  };

  const updateTask = (index: number, field: 'title' | 'description', value: string) => {
    const newTasks = [...tasks];
    newTasks[index] = { ...newTasks[index], [field]: value };
    setTasks(newTasks);
    onChange({ roadmapTasks: newTasks });
  };

  return (
    <div className="space-y-4 h-[450px] flex flex-col animate-in slide-in-from-right-4 duration-300">
      <div className="text-center space-y-1 shrink-0">
        <h3 className="text-xl font-bold text-white">Lên Lộ Trình</h3>
        <p className="text-zinc-400 text-sm">Xây dựng kế hoạch cụ thể cho từng ngày (Tùy chọn)</p>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
        {tasks.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-900/50">
            <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                 <Calendar className="w-6 h-6 text-zinc-500" />
            </div>
            <p className="text-zinc-400 font-medium">Chưa có nhiệm vụ nào.</p>
            <p className="text-zinc-600 text-xs mt-1">Thêm nhiệm vụ để thành viên biết cần làm gì mỗi ngày.</p>
            <button 
                onClick={addTask} 
                className="mt-6 px-4 py-2 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg text-sm font-bold transition-all"
            >
              + Thêm ngày đầu tiên
            </button>
          </div>
        ) : (
          tasks.map((task, idx) => (
            <div key={idx} className="flex gap-4 items-start animate-in slide-in-from-bottom-2 duration-300 group">
              <div className="w-14 shrink-0 pt-2 text-center">
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Ngày</span>
                <div className="text-2xl font-black text-blue-500">{task.dayNo}</div>
              </div>
              
              <div className="flex-1 bg-zinc-900 p-4 rounded-xl border border-zinc-800 hover:border-zinc-600 transition-colors focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500/50">
                <input 
                  placeholder="Tiêu đề nhiệm vụ (VD: Chạy 5km)"
                  className="w-full bg-transparent border-none outline-none text-white font-bold text-lg placeholder:text-zinc-700 mb-2"
                  value={task.title}
                  onChange={(e) => updateTask(idx, 'title', e.target.value)}
                  autoFocus={idx === tasks.length - 1 && !task.title}
                />
                <textarea 
                  placeholder="Mô tả chi tiết cách thực hiện..."
                  className="w-full bg-transparent border-none outline-none text-zinc-400 text-sm resize-none h-12 placeholder:text-zinc-800"
                  value={task.description}
                  onChange={(e) => updateTask(idx, 'description', e.target.value)}
                />
              </div>
              
              <button 
                onClick={() => removeTask(idx)}
                className="p-2 mt-3 text-zinc-700 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Xóa ngày này"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>

      {tasks.length > 0 && (
        <button 
            onClick={addTask}
            className="w-full py-4 border border-dashed border-zinc-700 text-zinc-400 hover:text-white hover:border-blue-500 hover:bg-blue-500/5 rounded-xl transition-all flex items-center justify-center gap-2 shrink-0 font-medium"
        >
            <Plus className="w-5 h-5" /> Thêm nhiệm vụ tiếp theo
        </button>
      )}
    </div>
  );
};