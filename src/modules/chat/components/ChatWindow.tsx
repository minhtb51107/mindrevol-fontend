import React, { useEffect, useRef, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { chatService } from '../services/chat.service';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { MessageBubble } from './MessageBubble';
import { ChevronLeft, Send, Heart, MoreHorizontal, Smile } from 'lucide-react'; // Thêm icon Smile
import { Message, MessageType, MessageDeliveryStatus } from '../types';
import { socket } from '@/lib/socket';
import { cn } from '@/lib/utils';
// Import thư viện Emoji
import EmojiPicker, { Theme } from 'emoji-picker-react'; 

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
  // State để bật tắt bảng Emoji
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  // Ref để xử lý click ra ngoài thì đóng bảng emoji
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeConversationId);
  const currentMessages = activeConversationId ? (messages[activeConversationId] || []) : [];

  // --- LOGIC LOAD DATA & SOCKET (GIỮ NGUYÊN) ---
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

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  // Đóng emoji picker khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
            setShowEmojiPicker(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      setTimeout(() => {
          scrollRef.current!.scrollTop = scrollRef.current!.scrollHeight;
      }, 0);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    // ... (Logic typing giữ nguyên)
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

  // Logic chọn Emoji
  const onEmojiClick = (emojiObject: any) => {
    setInputText((prev) => prev + emojiObject.emoji);
    // Không đóng bảng để user chọn tiếp nếu muốn
  };

  const handleSend = async (content: string = inputText, type: MessageType = MessageType.TEXT) => {
    if (!content.trim() && type === MessageType.TEXT) return;
    if (!activeConv) return;
    
    // Đóng emoji picker khi gửi
    setShowEmojiPicker(false);

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

  // --- STYLE CHO THANH CUỘN (SCROLLBAR) HIỆN ĐẠI ---
  const scrollbarStyles = `
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent; 
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #3f3f46; 
        border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #52525b; 
    }
  `;

  if (!activeConv) {
     // ... (Giữ nguyên màn hình chờ)
     return (
        <div className="hidden md:flex flex-col items-center justify-center bg-[#0a0a0a] h-full text-zinc-500">
             {/* ... Code cũ ... */}
             <p className="text-base font-medium tracking-wide">Chọn một người bạn để bắt đầu</p>
        </div>
     );
  }

  return (
    <div className="flex flex-col h-full bg-[#0a0a0a] relative font-sans">
      <style>{scrollbarStyles}</style>

<div className="h-[72px] absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 md:px-6 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
          {/* Back Button (Mobile) */}
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 -ml-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/10">
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          {/* Avatar Partner */}
          <div className="relative group cursor-pointer">
             <div className="w-10 h-10 rounded-full p-[2px] bg-gradient-to-tr from-zinc-800 via-zinc-700 to-zinc-800 group-hover:from-yellow-500 group-hover:to-orange-500 transition-all duration-500">
                 <img src={activeConv.partner.avatarUrl || "/default-avatar.png"} className="w-full h-full rounded-full object-cover bg-zinc-900 border-2 border-[#0a0a0a]" />
             </div>
             {activeConv.partner.isOnline && (
                 <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-[2px] border-[#0a0a0a]"></div>
             )}
          </div>
          
          {/* Name & Status */}
          <div className="flex flex-col justify-center">
            <h3 className="font-bold text-zinc-100 text-[16px] leading-tight tracking-wide cursor-pointer hover:opacity-80 transition-opacity">
                {activeConv.partner.fullname}
            </h3>
            <span className="text-[12px] font-medium leading-tight mt-0.5">
                {activeConv.isTyping ? (
                    <span className="text-blue-400 animate-pulse font-semibold">Đang nhập...</span>
                ) : (
                    <span className={activeConv.partner.isOnline ? "text-zinc-400" : "text-zinc-600"}>
                        {activeConv.partner.isOnline ? 'Đang hoạt động' : 'Offline'}
                    </span>
                )}
            </span>
          </div>
        </div>

        {/* Header Actions: Chỉ giữ lại nút Option */}
        <button className="p-2 text-zinc-500 hover:text-zinc-200 hover:bg-white/5 rounded-full transition-all">
            <MoreHorizontal className="w-6 h-6" />
        </button>
      </div>

      {/* BODY: Chat Content */}
      <div 
        ref={scrollRef} 
        // Thêm class custom-scrollbar
        className="flex-1 overflow-y-auto pt-[80px] pb-4 px-3 md:px-4 custom-scrollbar scroll-smooth"
      >
        {/* ... Logic render tin nhắn giữ nguyên ... */}
        <div className="space-y-[2px]">
            {currentMessages.map((msg, index) => {
                const isMe = msg.senderId === user?.id;
                const nextMsg = currentMessages[index + 1];
                const isLastInGroup = !nextMsg || nextMsg.senderId !== msg.senderId;
                const showAvatar = !isMe && isLastInGroup;
                
                return (
                    <div key={msg.clientSideId || msg.id} className={cn("transition-all duration-300", isLastInGroup ? "mb-5" : "")}>
                         <MessageBubble 
                            message={msg} 
                            isMe={isMe} 
                            showAvatar={showAvatar}
                            avatarUrl={activeConv.partner.avatarUrl}
                        />
                    </div>
                );
            })}
        </div>
      </div>

      {/* FOOTER: Floating Input */}
      <div className="px-4 pb-4 pt-2 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent shrink-0 z-30">
        <div className="max-w-4xl mx-auto flex items-end gap-2 bg-[#1c1c1e] border border-white/5 rounded-[26px] p-1.5 shadow-2xl shadow-black/50 relative">
          
          {/* Nút Emoji */}
          <div className="relative" ref={emojiPickerRef}>
              {showEmojiPicker && (
                  <div className="absolute bottom-12 left-0 z-50 shadow-2xl rounded-2xl border border-white/10">
                      <EmojiPicker 
                        theme={Theme.DARK} 
                        onEmojiClick={onEmojiClick}
                        width={300}
                        height={400}
                        searchDisabled
                        skinTonesDisabled
                      />
                  </div>
              )}
              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={cn(
                    "p-2.5 transition-all rounded-full active:scale-90",
                    showEmojiPicker ? "text-yellow-400 bg-yellow-400/10" : "text-zinc-400 hover:text-yellow-400 hover:bg-yellow-400/10"
                )}
                title="Biểu cảm"
              >
                <Smile className="w-6 h-6" />
              </button>
          </div>

          <div className="flex-1 py-3 px-1">
            <input 
                value={inputText}
                onChange={handleTyping}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Gửi tin nhắn..."
                className="w-full bg-transparent border-none outline-none text-zinc-100 placeholder:text-zinc-600 text-[16px] font-normal leading-relaxed"
            />
          </div>
          
          <button 
            onClick={() => handleSend()}
            disabled={!inputText.trim()}
            className={cn(
                "w-11 h-11 rounded-full transition-all duration-300 flex items-center justify-center mb-[1px]",
                inputText.trim() 
                ? "bg-white text-black hover:bg-zinc-200 hover:scale-105 shadow-lg" 
                : "bg-[#2c2c2e] text-zinc-500 cursor-not-allowed"
            )}
          >
            <Send className={cn("w-5 h-5", inputText.trim() && "ml-0.5")} />
          </button>
        </div>
      </div>
    </div>
  );
};