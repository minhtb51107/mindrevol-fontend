import React, { useEffect, useState } from 'react';
import { ConversationList } from '../components/ConversationList';
import { ChatWindow } from '../components/ChatWindow';
import { chatService } from '../services/chat.service';
import { useChatStore } from '../store/useChatStore';
import { useChatSocket } from '../hooks/useChatSocket'; 
import MainLayout from '@/components/layout/MainLayout';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils'; // [MỚI] Import cn để xử lý class động

const ChatPage = () => {
  const { activeConversationId, setConversations } = useChatStore();
  const [isLoading, setIsLoading] = useState(true);

  useChatSocket(); 

  useEffect(() => {
    const fetchConvos = async () => {
        setIsLoading(true);
        try {
            const res: any = await chatService.getConversations();
            setConversations(res);
        } catch (e) {
            console.error("Lỗi tải danh sách chat:", e);
        } finally {
            setIsLoading(false);
        }
    };
    fetchConvos();
  }, [setConversations]);

  return (
    <MainLayout>
        <div className="flex w-full h-full bg-[#121212] overflow-hidden relative">
          
          {/* CỘT TRÁI: DANH SÁCH 
              - Mobile: Nếu đang chat (activeConversationId có giá trị) thì ẩn đi (hidden).
              - Desktop (md): Luôn hiện (md:flex).
          */}
          <div className={cn(
            "h-full bg-[#121212] transition-all duration-300",
            // Mobile logic:
            activeConversationId ? "hidden" : "w-full flex",
            // Desktop logic:
            "md:flex md:w-auto"
          )}>
             <ConversationList />
          </div>

          {/* CỘT PHẢI: CỬA SỔ CHAT
              - Mobile: Nếu chưa chọn chat thì ẩn (hidden). Nếu đã chọn thì hiện full (w-full).
              - Desktop (md): Luôn hiện và chiếm phần còn lại (md:flex md:flex-1).
          */}
          <div className={cn(
            "h-full bg-[#121212] flex flex-col min-w-0 border-l border-white/5",
            // Mobile logic:
            !activeConversationId ? "hidden" : "w-full flex fixed inset-0 z-50 md:static",
            // Desktop logic:
            "md:flex md:flex-1"
          )}>
            
            {isLoading ? (
               <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
                  <Loader2 className="w-8 h-8 animate-spin text-zinc-600 mb-2" />
                  <p className="text-sm">Đang đồng bộ tin nhắn...</p>
               </div>
            ) : (
                <>
                    {activeConversationId ? (
                        <ChatWindow />
                    ) : (
                        /* Màn hình chờ (Chỉ hiện trên Desktop vì Mobile đã ẩn cột này nếu ko có ID) */
                        <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 select-none p-4 text-center">
                            <div className="w-24 h-24 bg-zinc-900/50 rounded-full flex items-center justify-center mb-6 ring-1 ring-white/5">
                                <span className="text-5xl drop-shadow-sm">💬</span>
                            </div>
                            <h3 className="font-bold text-xl text-white mb-2">Tin nhắn của bạn</h3>
                            <p className="text-sm text-zinc-400 max-w-xs mx-auto">
                                Chọn một cuộc trò chuyện để bắt đầu nhắn tin hoặc chia sẻ khoảnh khắc.
                            </p>
                        </div>
                    )}
                </>
            )}
          </div>
        </div>
    </MainLayout>
  );
};

export default ChatPage;