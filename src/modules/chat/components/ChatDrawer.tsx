// src/modules/chat/components/ChatDrawer.tsx
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/modules/auth/store/AuthContext'; // Đảm bảo đường dẫn đúng
import { socket } from '@/lib/socket';
import { chatService, Message } from '../services/chat.service';

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  partnerId: number; // ID người mình đang chat cùng
  partnerName: string;
  partnerAvatar?: string;
}

export default function ChatDrawer({ isOpen, onClose, partnerId, partnerName, partnerAvatar }: ChatDrawerProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMsg, setInputMsg] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Load lịch sử chat khi mở Drawer
  useEffect(() => {
    if (isOpen && partnerId) {
      chatService.getHistory(partnerId).then((data: any) => {
        // Backend trả về sort DESC (mới nhất trước), ta cần đảo lại để hiện đúng thứ tự
        setMessages(data.content.reverse());
      });
      
      // Đánh dấu đã đọc
      chatService.markAsRead(partnerId);
    }
  }, [isOpen, partnerId]);

  // 2. Lắng nghe tin nhắn mới qua WebSocket
  useEffect(() => {
    if (!user) return;

    // Subscribe vào kênh riêng của mình: /user/queue/messages
    // Lưu ý: Cần đảm bảo component này nằm trong Tree đã connect socket (thường là ở App.tsx)
    const sub = socket.subscribe('/user/queue/messages', (newMsg: Message) => {
      // Chỉ nhận tin nếu đúng là từ người mình đang chat
      if (newMsg.senderId === partnerId || newMsg.senderId === user.id) {
        setMessages(prev => [...prev, newMsg]);
        scrollToBottom();
      }
    });

    return () => {
      sub?.unsubscribe();
    };
  }, [user, partnerId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = () => {
    if (!inputMsg.trim()) return;

    // Gửi qua API (HTTP) hoặc Socket đều được. 
    // Backend bạn có API: POST /api/v1/chat/send
    // Nhưng gửi qua Socket sẽ nhanh hơn (realtime direct).
    // Ở đây tôi dùng API HTTP để đảm bảo tính đồng bộ response trước.
    
    // Gọi Socket để gửi (Optimistic UI)
    const tempMsg: Message = {
      id: Date.now(),
      senderId: user!.id,
      senderName: user!.fullname,
      senderAvatar: user!.avatarUrl || '',
      content: inputMsg,
      type: 'TEXT',
      createdAt: new Date().toISOString(),
      isRead: false
    };
    
    // Update UI ngay lập tức
    setMessages(prev => [...prev, tempMsg]);
    setInputMsg('');
    scrollToBottom();

    // Gửi API thật
    // Nếu dùng socket: socket.send('/app/chat.send', { receiverId: partnerId, content: inputMsg });
    // Nếu dùng HTTP (như Controller bạn có):
    import('@/lib/http').then(({ http }) => {
        http.post('/chat/send', { receiverId: partnerId, content: tempMsg.content });
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay mờ */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />
          
          {/* Drawer chính */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white dark:bg-zinc-900 shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={partnerAvatar || '/default-avatar.png'} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h3 className="font-bold text-zinc-800 dark:text-white">{partnerName}</h3>
                  <span className="text-xs text-green-500">Đang hoạt động</span>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-zinc-100 rounded-full">✕</button>
            </div>

            {/* Body Tin nhắn */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-black/20">
              {messages.map((msg) => {
                const isMe = msg.senderId === user?.id;
                return (
                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                      isMe 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white rounded-tl-none shadow-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Footer Input */}
            <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={inputMsg}
                  onChange={(e) => setInputMsg(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Nhập tin nhắn..." 
                  className="flex-1 bg-zinc-100 dark:bg-zinc-800 border-none rounded-full px-4 py-2 focus:ring-2 focus:ring-primary outline-none"
                />
                <button 
                  onClick={handleSend}
                  className="bg-primary text-white p-3 rounded-full hover:bg-primary/90 transition-colors"
                >
                  ➤
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}