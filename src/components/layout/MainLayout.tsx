import React from 'react';
import { Sidebar } from './Sidebar';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { Search, Plus } from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
      
      {/* CỘT 1: Sidebar (Cố định bên trái) */}
      <Sidebar />

      {/* KHU VỰC NỘI DUNG (Padding left để né Sidebar) */}
      <div className="ml-[80px] xl:ml-[280px] flex min-h-screen">
        
        {/* CỘT 2: Feed Chính (Giữa - Rộng tối đa 680px) */}
        <main className="flex-1 max-w-[680px] w-full border-r border-border min-h-screen relative">
          
          {/* Header Mobile (Chỉ hiện khi màn hình nhỏ < 1024px) */}
          <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border p-4 flex justify-between items-center lg:hidden">
             <span className="font-bold text-xl">MindRevol</span>
             <ThemeToggle />
          </header>

          {/* Nội dung trang con sẽ nằm ở đây */}
          {children}
        
        </main>

        {/* CỘT 3: Widgets (Phải - Ẩn trên Tablet/Mobile) */}
        <aside className="hidden lg:block flex-1 p-8 sticky top-0 h-screen overflow-y-auto w-[350px]">
          
          {/* Top Bar: Search & Theme */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted group-focus-within:text-primary transition-colors" />
              <input 
                type="text" 
                placeholder="Tìm kiếm..." 
                className="w-full bg-surface border border-transparent focus:border-primary/50 focus:bg-background rounded-full pl-12 pr-4 py-3 outline-none transition-all placeholder:text-muted text-foreground"
              />
            </div>
            <ThemeToggle />
          </div>

          {/* Widget 1: Streak (Động lực) */}
          <div className="bg-surface rounded-3xl p-5 mb-6 border border-border relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl pointer-events-none"></div>
            <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
              🔥 Streak Tuần
            </h3>
            <p className="text-sm text-muted mb-4">Bạn đã check-in liên tục 3 ngày!</p>
            <div className="flex justify-between items-end">
               {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, i) => (
                 <div key={day} className="flex flex-col items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i < 3 ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-background border border-border text-muted'}`}>
                      {i < 3 ? '✓' : ''}
                    </div>
                    <span className="text-[10px] font-bold text-muted">{day}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Widget 2: Gợi ý bạn bè */}
          <div className="bg-surface rounded-3xl p-5 border border-border">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Đồng hành mới</h3>
              <button className="text-primary text-xs font-bold hover:underline">Xem tất cả</button>
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-zinc-700" />
                  <div className="flex-1">
                    <p className="text-sm font-bold">User {i}</p>
                    <p className="text-xs text-muted">Cũng thích Lập trình</p>
                  </div>
                  <button className="p-2 bg-background hover:bg-primary hover:text-white border border-border rounded-xl transition-colors">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 text-xs text-muted leading-relaxed">
            &copy; 2024 MindRevol Inc. <br/>
            Sản phẩm tốt nghiệp - Xây dựng với ❤️ và ☕.
          </div>

        </aside>
      </div>
    </div>
  );
};

export default MainLayout;