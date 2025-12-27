import React, { useEffect, useState } from 'react';
import { ConversationList } from '../components/ConversationList';
import { ChatWindow } from '../components/ChatWindow';
import { chatService } from '../services/chat.service';
import { useChatStore } from '../store/useChatStore';
import MainLayout from '@/components/layout/MainLayout';

const ChatPage = () => {
  const { activeConversationId, setConversations } = useChatStore();
  const [isLoading, setIsLoading] = useState(false);

  // [FIX CRITICAL]: Fetch dữ liệu và ĐẨY VÀO STORE
  // Nếu không có bước này, ChatWindow sẽ không tìm thấy hội thoại để hiển thị -> Màn hình trắng.
  useEffect(() => {
    const fetchConvos = async () => {
        setIsLoading(true);
        try {
            const res: any = await chatService.getConversations();
            setConversations(res); // <-- Cập nhật Store tại đây
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };
    fetchConvos();
  }, [setConversations]);

  return (
    <MainLayout>
        {/* Layout Chat Full Màn Hình */}
        <div className="flex w-full h-full bg-[#121212]">
          
          {/* CỘT TRÁI: DANH SÁCH (Tự responsive trong component) */}
          <ConversationList />

          {/* CỘT PHẢI: CỬA SỔ CHAT */}
          <div className="flex-1 h-full bg-[#121212] relative flex flex-col min-w-0 border-l border-white/5">
            {activeConversationId ? (
               <ChatWindow />
            ) : (
               /* Màn hình chờ khi chưa chọn chat */
               <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 select-none p-4 text-center">
                  <div className="w-20 h-20 bg-zinc-900/50 rounded-full flex items-center justify-center mb-4">
                      <span className="text-4xl">💬</span>
                  </div>
                  <p className="font-medium text-lg text-white mb-2">Tin nhắn của bạn</p>
                  <p className="text-sm">Gửi ảnh và tin nhắn riêng tư cho bạn bè.</p>
               </div>
            )}
          </div>
        </div>
    </MainLayout>
  );
};

export default ChatPage;