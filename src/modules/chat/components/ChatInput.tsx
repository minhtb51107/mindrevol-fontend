import React from 'react';
import { Send, Mic, Trash2, X, Reply, Sticker, Smile, Edit2 } from 'lucide-react';
import EmojiPicker, { Theme } from 'emoji-picker-react';
import { GifPicker } from './GifPicker';
import { StickerPicker } from './StickerPicker';
import { useChatInput } from '../hooks/useChatInput';

interface ChatInputProps {
  onSend: (content: string, type?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'VOICE' | 'FILE', file?: File) => void;
  onEdit?: (messageId: string, content: string) => void; 
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, onEdit }) => {
  const {
      theme, text, setText,
      showEmojiPicker, showGifPicker, showStickerPicker,
      selectedFile,
      replyingTo, setReplyingTo, editingMessage, setEditingMessage,
      emojiPickerRef, recorder,
      handleSend, handleSendGif, handleSendSticker, handleStopRecording,
      toggleEmoji, toggleGif, toggleSticker, handleTextChange
  } = useChatInput(onSend, onEdit);

  return (
    // Đã xóa absolute, chuyển sang flex block bám đáy tự nhiên của container
    <div className="w-full px-4 pb-4 pt-2 shrink-0 flex flex-col z-20">
      
      {replyingTo && !editingMessage && (
         <div className="w-full flex items-center justify-between mb-2 p-3 bg-zinc-100/80 dark:bg-zinc-800/80 border border-zinc-200/50 dark:border-zinc-700/50 rounded-[16px] backdrop-blur-md">
            <div className="flex items-center gap-3 overflow-hidden flex-1">
                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center"><Reply className="w-4 h-4 text-zinc-600 dark:text-zinc-300" /></div>
                <div className="flex flex-col min-w-0 flex-1">
                   <span className="text-[13px] font-bold text-zinc-800 dark:text-zinc-200 truncate" style={{ fontFamily: '"Nunito", sans-serif' }}>Đang trả lời tin nhắn</span>
                   <span className="text-[14px] font-semibold text-zinc-500 dark:text-zinc-400 truncate" style={{ fontFamily: '"Nunito", sans-serif' }}>
                       {replyingTo.type === 'IMAGE' ? '[Hình ảnh]' : replyingTo.type === 'VOICE' ? '[Ghi âm]' : replyingTo.content}
                   </span>
                </div>
            </div>
            <button onClick={() => setReplyingTo(null)} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-full text-zinc-500 transition-colors"><X className="w-4 h-4" /></button>
         </div>
      )}

      {editingMessage && (
         <div className="w-full flex items-center justify-between mb-2 p-3 bg-blue-50/80 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 rounded-[16px] backdrop-blur-md">
            <div className="flex items-center gap-3 overflow-hidden flex-1">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center"><Edit2 className="w-4 h-4 text-blue-500" /></div>
                <div className="flex flex-col min-w-0 flex-1">
                   <span className="text-[13px] font-bold text-blue-800 dark:text-blue-300 truncate" style={{ fontFamily: '"Nunito", sans-serif' }}>Đang chỉnh sửa tin nhắn</span>
                </div>
            </div>
            <button onClick={() => { setEditingMessage(null); setText(''); }} className="p-2 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full transition-colors"><X className="w-4 h-4 text-blue-500" /></button>
         </div>
      )}

      <div className="w-full bg-white dark:bg-zinc-800 rounded-[24px] p-2 flex items-end gap-2 border border-transparent dark:border-zinc-700 shadow-[0_2px_12px_rgba(0,0,0,0.04)] focus-within:ring-2 focus-within:ring-zinc-200 dark:focus-within:ring-zinc-700 transition-all">

        {!recorder.isRecording && (
          <div className="relative shrink-0 flex gap-1" ref={emojiPickerRef}>
              
              {showEmojiPicker && (
                  <div className="absolute bottom-14 left-0 z-50 shadow-2xl rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                      <EmojiPicker theme={theme === 'dark' ? Theme.DARK : Theme.LIGHT} onEmojiClick={(e) => setText(p => p + e.emoji)} width={300} height={400} />
                  </div>
              )}
              {showGifPicker && (
                  <div className="absolute bottom-14 left-0 z-50 shadow-2xl rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                      <GifPicker onSelect={handleSendGif} />
                  </div>
              )}
              {showStickerPicker && (
                  <div className="absolute bottom-14 left-0 z-50 shadow-2xl rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-700">
                      <StickerPicker onSelect={handleSendSticker} />
                  </div>
              )}

              <button onClick={toggleEmoji} className="w-10 h-10 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 flex items-center justify-center transition-transform active:scale-90" title="Emoji">
                <Smile className="w-5 h-5" />
              </button>
              <button onClick={toggleSticker} className="w-10 h-10 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 flex items-center justify-center transition-transform active:scale-90" title="Sticker">
                <Sticker className="w-5 h-5" />
              </button>
              <button onClick={toggleGif} className="w-10 h-10 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-500 dark:text-zinc-400 flex items-center justify-center font-bold text-xs transition-transform active:scale-90" style={{ fontFamily: '"Jua", sans-serif' }} title="GIF">
                GIF
              </button>
          </div>
        )}

        {recorder.isRecording ? (
            <div className="flex-1 flex items-center justify-between py-[8px] px-4 mx-2 bg-red-50 dark:bg-red-500/10 rounded-full border border-red-100 dark:border-red-500/30">
                <span className="text-red-500 font-bold tracking-wider">{recorder.recordingTime}s</span>
                <button onClick={recorder.cancelRecording} className="text-zinc-400 hover:text-red-500 transition-colors"><Trash2 className="w-5 h-5" /></button>
            </div>
        ) : (
            <div className="flex-1 min-w-0 py-2.5 px-2">
              <input 
                value={text} 
                onChange={handleTextChange}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()} 
                placeholder={editingMessage ? "Nhập nội dung mới..." : "Nhập tin nhắn..."} 
                className="w-full bg-transparent border-none outline-none text-zinc-800 dark:text-white font-semibold text-[15.5px] placeholder:text-zinc-400 dark:placeholder:text-zinc-500" 
                style={{ fontFamily: '"Nunito", sans-serif' }}
              />
            </div>
        )}

        {(!text.trim() && !selectedFile && !recorder.isRecording) ? (
            <button
              type="button" 
              onMouseDown={recorder.startRecording} 
              onMouseUp={handleStopRecording} 
              onTouchStart={recorder.startRecording} 
              onTouchEnd={handleStopRecording} 
              className="w-10 h-10 shrink-0 rounded-full bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-600 flex items-center justify-center active:scale-95 transition-all"
            >
              <Mic className="w-[18px] h-[18px]" />
            </button>
        ) : (
            <button 
              onClick={handleSend}
              className="w-10 h-10 shrink-0 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-white flex items-center justify-center active:scale-95 transition-all shadow-sm"
            >
              <Send className="w-[18px] h-[18px] ml-0.5" />
            </button>
        )}
      </div>
    </div>
  );
};