// src/modules/chat/components/ChatInput.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Smile, Send } from 'lucide-react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (text: string) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend }) => {
  const [text, setText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
            setShowEmojiPicker(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText('');
    setShowEmojiPicker(false);
  };

  const onEmojiClick = (emojiObject: any) => {
    setText((prev) => prev + emojiObject.emoji);
  };

  return (
    // Giữ nguyên wrapper footer gradient
    <div className="px-4 pb-4 pt-2 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a] to-transparent shrink-0 z-30">
      {/* Giữ nguyên style container input: rounded-[26px], shadow-black/50 */}
      <div className="max-w-4xl mx-auto flex items-end gap-2 bg-[#1c1c1e] border border-white/5 rounded-[26px] p-1.5 shadow-2xl shadow-black/50 relative">
        
        {/* Nút Emoji */}
        <div className="relative" ref={emojiPickerRef}>
            {showEmojiPicker && (
                <div className="absolute bottom-14 left-0 z-50 shadow-2xl rounded-2xl border border-white/10 overflow-hidden">
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
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Gửi tin nhắn..."
              // Giữ nguyên style input transparent
              className="w-full bg-transparent border-none outline-none text-zinc-100 placeholder:text-zinc-600 text-[16px] font-normal leading-relaxed"
          />
        </div>
        
        <button 
          onClick={() => handleSend()}
          disabled={!text.trim()}
          className={cn(
              "w-11 h-11 rounded-full transition-all duration-300 flex items-center justify-center mb-[1px]",
              text.trim() 
              ? "bg-white text-black hover:bg-zinc-200 hover:scale-105 shadow-lg" 
              : "bg-[#2c2c2e] text-zinc-500 cursor-not-allowed"
          )}
        >
          <Send className={cn("w-5 h-5", text.trim() && "ml-0.5")} />
        </button>
      </div>
    </div>
  );
};