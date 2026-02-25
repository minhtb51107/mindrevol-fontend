import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2, Sparkles, Palette, Smile } from 'lucide-react';
import EmojiPicker, { Theme, EmojiStyle, EmojiClickData } from 'emoji-picker-react'; // Sử dụng thư viện emoji
import { boxService } from '../services/box.service';

interface CreateBoxModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const QUICK_TEMPLATES = [
    { label: 'Du lịch', name: 'Chuyến đi khám phá', avatar: '✈️', color: '#0ea5e9', desc: 'Lưu giữ những hành trình mới' },
    { label: 'Gia đình', name: 'Kỷ niệm gia đình', avatar: '🏡', color: '#10b981', desc: 'Mọi khoảnh khắc bên người thân' },
    { label: 'Bạn bè', name: 'Hội bạn thân', avatar: '🍻', color: '#f59e0b', desc: 'Góc tụ tập và vui chơi' },
    { label: 'Cặp đôi', name: 'Hành trình yêu', avatar: '❤️', color: '#ec4899', desc: 'Kỷ niệm riêng của hai người' },
];

const PRESET_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

export const CreateBoxModal: React.FC<CreateBoxModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [themeColor, setThemeColor] = useState(PRESET_COLORS[0]);
    const [avatar, setAvatar] = useState('📦');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const onEmojiClick = (emojiData: EmojiClickData) => {
        setAvatar(emojiData.emoji);
        setShowEmojiPicker(false);
    };

    const handleApplyTemplate = (tpl: typeof QUICK_TEMPLATES[0]) => {
        setName(tpl.name);
        setAvatar(tpl.avatar);
        setThemeColor(tpl.color);
        setDescription(tpl.desc);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return setError('Vui lòng nhập tên Không gian.');
        try {
            setIsLoading(true);
            await boxService.createBox({ name: name.trim(), description, themeColor, avatar });
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Lỗi khi tạo Không gian.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
            {/* Thanh cuộn Custom mỏng */}
            <style>{`
                .box-slim-scroll::-webkit-scrollbar { width: 3px; }
                .box-slim-scroll::-webkit-scrollbar-track { background: transparent; }
                .box-slim-scroll::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 10px; }
            `}</style>

            <div className="bg-[#121212] w-full max-w-lg rounded-[32px] border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
                
                {/* Header */}
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-zinc-900/50">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Sparkles size={22} className="text-blue-400" />
                        Tạo Không gian
                    </h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto box-slim-scroll flex-1 space-y-8">
                    {/* 1. Gợi ý nhanh */}
                    <div>
                        <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-4">Gợi ý chủ đề nhanh</p>
                        <div className="flex gap-2 flex-wrap">
                            {QUICK_TEMPLATES.map((tpl) => (
                                <button
                                    key={tpl.label}
                                    type="button"
                                    onClick={() => handleApplyTemplate(tpl)}
                                    className="px-4 py-2 rounded-2xl bg-zinc-800/50 border border-white/5 text-zinc-300 text-sm font-medium hover:bg-white hover:text-black hover:border-white transition-all"
                                >
                                    {tpl.avatar} {tpl.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <form id="create-box-form" onSubmit={handleSubmit} className="space-y-6">
                        {/* 2. Tên & Emoji Picker Thư viện */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-zinc-400 ml-1">Tên & Biểu tượng</label>
                            <div className="flex gap-4">
                                <div className="relative" ref={pickerRef}>
                                    <button
                                        type="button"
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                        className="h-14 w-14 flex items-center justify-center bg-zinc-800 border border-white/10 rounded-2xl text-3xl shadow-inner hover:bg-zinc-700 transition-colors"
                                    >
                                        {avatar}
                                    </button>
                                    
                                    {showEmojiPicker && (
                                        <div className="absolute top-16 left-0 z-[70] shadow-2xl">
                                            <EmojiPicker 
                                                onEmojiClick={onEmojiClick}
                                                theme={Theme.DARK}
                                                emojiStyle={EmojiStyle.NATIVE}
                                                lazyLoadEmojis={true}
                                                searchPlaceholder="Tìm biểu tượng..."
                                                width={300}
                                                height={400}
                                            />
                                        </div>
                                    )}
                                </div>
                                <input 
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Đặt tên cho không gian này..."
                                    className="flex-1 bg-zinc-800 border border-white/5 rounded-2xl px-5 text-white text-lg font-bold focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-zinc-600 shadow-inner"
                                />
                            </div>
                        </div>

                        {/* 3. Mô tả */}
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-zinc-400 ml-1">Mô tả mục đích</label>
                            <textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Ghi chú ngắn về không gian này (ví dụ: Team Marketing kỉ niệm 2025)"
                                rows={2}
                                className="w-full bg-zinc-800 border border-white/5 rounded-2xl px-5 py-4 text-white text-sm focus:ring-2 focus:ring-blue-500/50 outline-none transition-all resize-none shadow-inner"
                            />
                        </div>

                        {/* 4. Màu chủ đạo & Infinite Color Picker */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-semibold text-zinc-400 ml-1">Màu sắc định danh</label>
                                <div className="flex items-center gap-2 bg-zinc-800 px-3 py-1.5 rounded-full border border-white/5">
                                    <Palette size={14} className="text-zinc-500" />
                                    <input 
                                        type="color" 
                                        value={themeColor} 
                                        onChange={(e) => setThemeColor(e.target.value)} 
                                        className="w-5 h-5 bg-transparent border-none cursor-pointer" 
                                    />
                                    <span className="text-[10px] font-mono text-zinc-500 uppercase">{themeColor}</span>
                                </div>
                            </div>
                            <div className="flex gap-3 px-1">
                                {PRESET_COLORS.map(color => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setThemeColor(color)}
                                        className={`w-10 h-10 rounded-full transition-all duration-300 ${themeColor === color ? 'scale-110 ring-4 ring-blue-500/30 border-2 border-white' : 'opacity-40 hover:opacity-100 hover:scale-105'}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="p-6 bg-zinc-900/50 border-t border-white/5 flex gap-3">
                    <button 
                        onClick={onClose} 
                        className="flex-1 h-14 rounded-2xl font-bold text-zinc-400 hover:bg-white/5 transition-colors"
                    >
                        Hủy bỏ
                    </button>
                    <button 
                        type="submit" 
                        form="create-box-form" 
                        disabled={isLoading || !name.trim()} 
                        className="flex-[2] bg-white text-black h-14 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:hover:scale-100 shadow-[0_8px_20px_rgba(255,255,255,0.1)]"
                    >
                        {isLoading ? <Loader2 className="animate-spin mx-auto" /> : 'Bắt đầu Không gian'}
                    </button>
                </div>
            </div>
        </div>
    );
};