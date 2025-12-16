import React, { useEffect, useState } from 'react';
import { gamificationService } from '../services/gamification.service';
import { PointHistory } from '../types';
import { cn } from '@/lib/utils';
import { Coins, History } from 'lucide-react';

export const PointHistoryList = () => {
  const [history, setHistory] = useState<PointHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gamificationService.getPointHistory().then(data => {
      setHistory(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-zinc-500 text-xs text-center py-4">Đang tải lịch sử...</div>;
  if (history.length === 0) return <div className="text-zinc-500 text-xs text-center py-4">Chưa có giao dịch nào.</div>;

  return (
    <div className="space-y-3 mt-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
      {history.map(item => (
        <div key={item.id} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
              <History className="w-4 h-4 text-zinc-400" />
            </div>
            <div>
              <p className="text-white text-sm font-medium line-clamp-1">{item.description || item.source}</p>
              <p className="text-[10px] text-zinc-500">{new Date(item.createdAt).toLocaleString('vi-VN')}</p>
            </div>
          </div>
          <div className={cn("flex items-center gap-1 font-bold font-mono text-sm", item.amount > 0 ? "text-green-400" : "text-red-400")}>
            {item.amount > 0 ? '+' : ''}{item.amount} <Coins className="w-3.5 h-3.5"/>
          </div>
        </div>
      ))}
    </div>
  );
};