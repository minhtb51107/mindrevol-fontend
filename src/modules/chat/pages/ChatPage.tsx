import React, { useEffect, useState } from 'react';
import { ConversationList } from '../components/ConversationList';
import { ChatWindow } from '../components/ChatWindow';
import { chatService } from '../services/chat.service';
import { useChatStore } from '../store/useChatStore';
import { useChatSocket } from '../hooks/useChatSocket'; 
import MainLayout from '@/components/layout/MainLayout';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const ChatPage = () => {
  const { 
    activeConversationId, 
    setConversations,
    fetchConversations 
  } = useChatStore();
  
  const [isLoading, setIsLoading] = useState(true);

  useChatSocket(activeConversationId); 

  useEffect(() => {
    const initData = async () => {
        setIsLoading(true);
        try {
            if (fetchConversations) {
                await fetchConversations();
            } else {
                const res: any = await chatService.getConversations();
                setConversations(res);
            }
        } catch (e) {
            console.error("Lỗi tải danh sách chat:", e);
        } finally {
            setIsLoading(false);
        }
    };
    initData();
  }, [setConversations, fetchConversations]);

  return (
    <MainLayout>
        {/* Container khóa kín chiều cao toàn màn hình, bỏ các margin thừa */}
        <div className="flex w-full h-[100dvh] bg-[#121212] overflow-hidden text-white">
          
          {/* CỘT TRÁI: DANH SÁCH BẠN BÈ */}
          {/* Cố định width 350px trên Desktop, viền chia cách */}
          <div className={cn(
            "h-full shrink-0 border-r border-white/5",
            activeConversationId ? "hidden md:block md:w-[350px]" : "w-full md:w-[350px]"
          )}>
              <ConversationList />
          </div>

          {/* CỘT PHẢI: CỬA SỔ CHAT */}
          {/* Dãn tối đa flex-1 */}
          <div className={cn(
            "h-full flex-col flex-1 min-w-0 bg-[#0a0a0a]",
            !activeConversationId ? "hidden md:flex" : "flex w-full"
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