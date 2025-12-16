import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { chatService } from '../services/chat.service';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { MessageBubble } from './MessageBubble';
import { ChevronLeft, Send, Image as ImageIcon, Phone, Video, Info } from 'lucide-react';
import { Message, MessageType, MessageDeliveryStatus } from '../types';
import { socket } from '@/lib/socket';

export const ChatWindow = () => {
  const { 
    activeConversationId, 
    conversations, 
    messages, 
    setMessages, 
    addMessage,
    updateMessageStatus,
    setSidebarOpen,
    markAsRead
  } = useChatStore();
  
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const activeConv = conversations.find(c => c.id === activeConversationId);
  const currentMessages = activeConversationId ? (messages[activeConversationId] || []) : [];

  // 1. Load Messages & Mark Read
  useEffect(() => {
    if (!activeConversationId) return;

    const loadData = async () => {
      // Mark read ngay khi mở
      if (activeConv?.unreadCount && activeConv.unreadCount > 0) {
        chatService.markAsRead(activeConversationId);
        markAsRead(activeConversationId);
      }

      // Load history (nếu chưa có trong store hoặc muốn refresh)
      // Ở đây ta load đơn giản trang đầu tiên
      try {
        const partnerId = activeConv?.partner.id;
        if(partnerId) {
            const res: any = await chatService.getMessages(partnerId);
            // Backend trả về DESC, ta đảo lại thành ASC để hiển thị
            setMessages(activeConversationId, res.content.reverse());
            scrollToBottom();
        }
      } catch (e) { console.error(e); }
    };
    
    loadData();
  }, [activeConversationId]);

  // 2. Scroll to bottom on new message
  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  // 3. Handle Typing
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    
    if (!activeConv) return;

    // Gửi event typing start
    if (!typingTimeoutRef.current) {
        socket.send('/app/chat/typing', { 
            conversationId: activeConv.id,
            senderId: user?.id,
            receiverId: activeConv.partner.id,
            isTyping: true 
        });
    }

    // Debounce typing stop
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
        socket.send('/app/chat/typing', { 
            conversationId: activeConv.id,
            senderId: user?.id,
            receiverId: activeConv.partner.id,
            isTyping: false 
        });
        typingTimeoutRef.current = undefined;
    }, 2000);
  };

  // 4. Send Message (Optimistic UI)
  const handleSend = async () => {
    if (!inputText.trim() || !activeConv) return;

    const tempId = crypto.randomUUID();
    const tempMsg: Message = {
      id: Date.now(), // Fake ID
      conversationId: activeConv.id,
      senderId: user!.id,
      content: inputText,
      type: MessageType.TEXT,
      deliveryStatus: MessageDeliveryStatus.SENT, // Đang gửi
      createdAt: new Date().toISOString(),
      clientSideId: tempId
    };

    addMessage(tempMsg);
    setInputText('');
    scrollToBottom();

    try {
      const res = await chatService.sendMessage({
        receiverId: activeConv.partner.id,
        content: tempMsg.content,
        clientSideId: tempId
      });
      // Update thành công (ID thật từ server)
      updateMessageStatus(tempId, MessageDeliveryStatus.DELIVERED, res.id);
    } catch (e) {
      console.error(e);
      // Xử lý lỗi (hiện dấu chấm than đỏ)
    }
  };

  if (!activeConv) {
    return <div className="hidden md:flex flex-1 items-center justify-center bg-black text-zinc-500">Chọn đoạn chat để bắt đầu</div>;
  }

  return (
    <div className="flex-1 flex flex-col bg-black h-full relative">
      
      {/* Header */}
      <div className="h-16 border-b border-white/10 flex items-center px-4 justify-between bg-[#121212] shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-zinc-400">
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="relative">
             <img src={activeConv.partner.avatarUrl || "/default-avatar.png"} className="w-10 h-10 rounded-full object-cover" />
             {activeConv.partner.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#121212]"></div>}
          </div>
          
          <div>
            <h3 className="font-bold text-white text-sm">{activeConv.partner.fullname}</h3>
            {activeConv.partner.isOnline ? (
                <p className="text-[10px] text-green-500 font-medium">Đang hoạt động</p>
            ) : (
                <p className="text-[10px] text-zinc-500">Hoạt động gần đây</p>
            )}
          </div>
        </div>

        <div className="flex gap-4 text-blue-500">
            <Phone className="w-5 h-5 cursor-pointer hover:text-blue-400" />
            <Video className="w-5 h-5 cursor-pointer hover:text-blue-400" />
            <Info className="w-5 h-5 cursor-pointer hover:text-blue-400" />
        </div>
      </div>

      {/* Messages Body */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 custom-scrollbar flex flex-col space-y-1">
        {currentMessages.map((msg, index) => {
            const isMe = msg.senderId === user?.id;
            const isLast = index === currentMessages.length - 1;
            // Logic group tin nhắn (nếu tin trước cũng của người này thì không hiện avatar)
            const showAvatar = !isMe && (index === 0 || currentMessages[index-1].senderId !== msg.senderId);
            
            return (
                <MessageBubble 
                    key={msg.clientSideId || msg.id} 
                    message={msg} 
                    isMe={isMe} 
                    showAvatar={showAvatar}
                    avatarUrl={activeConv.partner.avatarUrl}
                />
            );
        })}
      </div>

      {/* Footer Input */}
      <div className="p-3 bg-[#121212] shrink-0">
        <div className="flex items-center gap-2 bg-zinc-900 border border-white/10 rounded-[24px] px-4 py-2 transition-all focus-within:border-blue-500/50 focus-within:bg-zinc-900/80">
          <button className="text-zinc-400 hover:text-blue-500 transition-colors">
            <ImageIcon className="w-6 h-6" />
          </button>
          
          <input 
            value={inputText}
            onChange={handleTyping}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Nhắn tin..."
            className="flex-1 bg-transparent border-none outline-none text-white h-9 text-sm placeholder:text-zinc-600"
          />
          
          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="text-blue-500 hover:text-blue-400 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};