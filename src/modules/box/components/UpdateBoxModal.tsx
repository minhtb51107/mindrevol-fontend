import React, { useState, useEffect, useRef } from 'react';
import { X, Loader2, Save, Palette, Smile } from 'lucide-react';
import EmojiPicker, { Theme, EmojiStyle, EmojiClickData } from 'emoji-picker-react';
import { boxService } from '../services/box.service';
import { BoxResponse, UpdateBoxRequest } from '../types';
import { toast } from 'react-hot-toast';

interface UpdateBoxModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    boxData: BoxResponse;
}

const PRESET_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

export const UpdateBoxModal: React.FC<UpdateBoxModalProps> = ({ isOpen, onClose, onSuccess, boxData }) => {
    const [name, setName] = useState(boxData.name);
    const [description, setDescription] = useState(boxData.description || '');
    const [themeColor, setThemeColor] = useState(boxData.themeColor || PRESET_COLORS[0]);
    const [avatar, setAvatar] = useState(boxData.avatar || '📦');
    
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return toast.error('Tên không được để trống');

        try {
            setIsLoading(true);
            const payload: UpdateBoxRequest = {
                name: name.trim(),
                description: description.trim(),
                themeColor,
                avatar
            };
            await boxService.updateBox(boxData.id, payload);
            toast.success('Cập nhật thành công!');
            onSuccess();
            onClose();
        } catch (err: any) {
            toast.error(err?.response?.data?.message || 'Có lỗi xảy ra');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
            <div className="bg-[#18181b] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
                
                <div className="p-5 border-b border-white/5 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Save size={18} className="text-blue-500" />
                        Chỉnh sửa Không gian
                    </h2>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white"><X size={20} /></button>
                </div>

                <div className="p-6 overflow-y-auto space-y-6">
                    <form id="update-box-form" onSubmit={handleSubmit} className="space-y-5">
                        {/* Tên & Icon */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Tên & Biểu tượng</label>
                            <div className="flex gap-3">
                                <div className="relative" ref={pickerRef}>
                                    <button
                                        type="button"
                                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                        className="h-12 w-12 flex items-center justify-center bg-zinc-800 border border-white/10 rounded-xl text-2xl hover:bg-zinc-700 transition"
                                    >
                                        {avatar}
                                    </button>
                                    {showEmojiPicker && (
                                        <div className="absolute top-14 left-0 z-50 shadow-2xl">
                                            <EmojiPicker onEmojiClick={onEmojiClick} theme={Theme.DARK} emojiStyle={EmojiStyle.NATIVE} width={300} height={350} />
                                        </div>
                                    )}
                                </div>
                                <input 
                                    type="text" value={name} onChange={(e) => setName(e.target.value)}
                                    className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 text-white font-bold focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Mô tả */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Mô tả</label>
                            <textarea 
                                value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
                                className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:border-blue-500 outline-none resize-none"
                            />
                        </div>

                        {/* Màu sắc */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase">Màu chủ đạo</label>
                            <div className="flex flex-wrap gap-3">
                                {PRESET_COLORS.map(color => (
                                    <button
                                        key={color} type="button" onClick={() => setThemeColor(color)}
                                        className={`w-8 h-8 rounded-full transition-all ${themeColor === color ? 'scale-110 ring-2 ring-white border-2 border-black' : 'opacity-50 hover:opacity-100'}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20">
                                    <input type="color" value={themeColor} onChange={(e) => setThemeColor(e.target.value)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                    <div className="w-full h-full flex items-center justify-center bg-zinc-800"><Palette size={14} /></div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="p-5 border-t border-white/5 flex justify-end gap-3 bg-zinc-900/50 rounded-b-2xl">
                    <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-bold text-zinc-400 hover:text-white">Hủy</button>
                    <button type="submit" form="update-box-form" disabled={isLoading} className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
                        {isLoading && <Loader2 size={16} className="animate-spin" />} Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    );
};