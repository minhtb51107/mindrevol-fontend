import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { chatService } from '../services/chat.service';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { MessageBubble } from './MessageBubble';
import { ChevronLeft, Send, Heart } from 'lucide-react'; // Thêm Heart, bỏ Image
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

  // 1. Load Data
  useEffect(() => {
    if (!activeConversationId) return;
    const loadData = async () => {
      if (activeConv?.unreadCount && activeConv.unreadCount > 0) {
        chatService.markAsRead(activeConversationId);
        markAsRead(activeConversationId);
      }
      try {
        const partnerId = activeConv?.partner.id;
        if(partnerId) {
            const res: any = await chatService.getMessages(partnerId);
            setMessages(activeConversationId, res.content.reverse());
            scrollToBottom();
        }
      } catch (e) { console.error(e); }
    };
    loadData();
  }, [activeConversationId]);

  // 2. Auto Scroll
  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      setTimeout(() => {
          scrollRef.current!.scrollTop = scrollRef.current!.scrollHeight;
      }, 0);
    }
  };

  // 3. Typing Logic
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (!activeConv) return;
    if (!typingTimeoutRef.current) {
        socket.send('/app/chat/typing', { 
            conversationId: activeConv.id, senderId: user?.id, receiverId: activeConv.partner.id, isTyping: true 
        });
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
        socket.send('/app/chat/typing', { 
            conversationId: activeConv.id, senderId: user?.id, receiverId: activeConv.partner.id, isTyping: false 
        });
        typingTimeoutRef.current = undefined;
    }, 2000);
  };

  // 4. Send Message
  const handleSend = async (content: string = inputText, type: MessageType = MessageType.TEXT) => {
    if (!content.trim() && type === MessageType.TEXT) return;
    if (!activeConv) return;

    const tempId = crypto.randomUUID();
    const tempMsg: Message = {
      id: Date.now(),
      conversationId: activeConv.id,
      senderId: user!.id,
      content: content,
      type: type,
      deliveryStatus: MessageDeliveryStatus.SENT,
      createdAt: new Date().toISOString(),
      clientSideId: tempId
    };

    addMessage(tempMsg);
    setInputText('');
    scrollToBottom();

    try {
      const res = await chatService.sendMessage({
        receiverId: activeConv.partner.id, content: tempMsg.content, clientSideId: tempId
      });
      updateMessageStatus(tempId, MessageDeliveryStatus.DELIVERED, res.id);
    } catch (e) { console.error(e); }
  };

  // Hàm gửi nhanh icon tim
  const sendQuickReaction = () => {
    handleSend('❤️', MessageType.TEXT); 
  };

  if (!activeConv) {
    return (
        <div className="hidden md:flex flex-1 items-center justify-center bg-[#121212] h-full text-zinc-600">
            <p className="text-sm font-medium">Chọn người bạn đồng hành</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#121212] overflow-hidden">
      
      {/* HEADER */}
      <div className="h-16 border-b border-white/5 flex items-center px-6 justify-between bg-[#121212]/90 backdrop-blur-md shrink-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <div className="relative">
             <img src={activeConv.partner.avatarUrl || "/default-avatar.png"} className="w-9 h-9 rounded-full object-cover ring-2 ring-[#121212]" />
             {activeConv.partner.isOnline && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#121212]"></div>}
          </div>
          
          <div className="flex flex-col justify-center">
            <h3 className="font-bold text-white text-[15px] leading-none mb-1">{activeConv.partner.fullname}</h3>
            <span className="text-[11px] text-zinc-500 font-medium leading-none">
                {activeConv.isTyping ? <span className="text-blue-400">Đang nhập...</span> : (activeConv.partner.isOnline ? 'Đang hoạt động' : 'Offline')}
            </span>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 md:px-6 py-4 custom-scrollbar flex flex-col space-y-1">
        <div className="text-center my-6">
            <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Hôm nay</span>
        </div>

        {currentMessages.map((msg, index) => {
            const isMe = msg.senderId === user?.id;
            const nextMsg = currentMessages[index + 1];
            const isLastInGroup = !nextMsg || nextMsg.senderId !== msg.senderId;
            const showAvatar = !isMe && isLastInGroup;
            
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

      {/* FOOTER */}
      <div className="p-4 bg-[#121212] shrink-0">
        <div className="flex items-center gap-2 bg-zinc-900/50 border border-white/5 rounded-full px-2 py-1.5 transition-all focus-within:border-white/10 focus-within:bg-zinc-900 focus-within:shadow-lg focus-within:shadow-black/50">
          
          {/* Nút Tim (Thay cho ảnh) */}
          <button 
            onClick={sendQuickReaction}
            className="p-2 text-red-500/80 hover:text-red-500 hover:scale-110 transition-all rounded-full hover:bg-white/5"
            title="Thả tim"
          >
            <Heart className="w-5 h-5 fill-current" />
          </button>
          
          <input 
            value={inputText}
            onChange={handleTyping}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Nhắn tin..."
            className="flex-1 bg-transparent border-none outline-none text-white h-full py-2 text-[15px] placeholder:text-zinc-600 px-1"
          />
          
          <button 
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className={`p-2 rounded-full transition-all duration-200 flex items-center justify-center ${
                inputText.trim() 
                ? 'bg-white text-black hover:scale-105 shadow-md' 
                : 'bg-transparent text-zinc-700 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};