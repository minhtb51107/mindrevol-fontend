import { useState, useRef, useEffect } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAudioRecorder } from '../hooks/useAudioRecorder';
import { useChatStore } from '../store/useChatStore';
import { socket } from '@/lib/socket';
import { useAuth } from '@/modules/auth/store/AuthContext';

export const useChatInput = (
    onSend: (content: string, type?: 'TEXT' | 'IMAGE' | 'VIDEO' | 'VOICE' | 'FILE', file?: File) => void,
    onEdit?: (messageId: string, content: string) => void
) => {
    const { theme } = useTheme();
    const [text, setText] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showGifPicker, setShowGifPicker] = useState(false);
    const [showStickerPicker, setShowStickerPicker] = useState(false); 
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    
    const { user } = useAuth();
    const { activeConversationId, replyingTo, setReplyingTo, editingMessage, setEditingMessage } = useChatStore(); 
    
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const emojiPickerRef = useRef<HTMLDivElement>(null);
    const recorder = useAudioRecorder();

    // Load nội dung cũ khi bấm nút "Sửa"
    useEffect(() => {
        if (editingMessage) {
            setText(editingMessage.content);
            setReplyingTo(null);
        }
    }, [editingMessage, setReplyingTo]);

    const handleSend = () => {
        if (!text.trim() && !selectedFile) return;

        if (editingMessage && onEdit) {
            onEdit(editingMessage.id, text);
            setEditingMessage(null);
        } else {
            if (selectedFile) {
                const type = selectedFile.type.startsWith('image/') ? 'IMAGE' : 'FILE';
                onSend(text || "File đính kèm", type, selectedFile);
                setSelectedFile(null);
            } else {
                onSend(text, 'TEXT');
            }
        }
        
        setText('');
        setShowEmojiPicker(false);
        setShowGifPicker(false);
        setShowStickerPicker(false);
    };

    const handleSendGif = (gifUrl: string) => { onSend(gifUrl, 'IMAGE'); setShowGifPicker(false); };
    const handleSendSticker = (stickerUrl: string) => { onSend(stickerUrl, 'IMAGE'); setShowStickerPicker(false); };

    const handleStopRecording = async () => {
        const file = await recorder.stopRecording();
        if (file) onSend("Tin nhắn thoại", 'VOICE', file);
    };

    const toggleEmoji = () => { setShowEmojiPicker(!showEmojiPicker); setShowGifPicker(false); setShowStickerPicker(false); };
    const toggleGif = () => { setShowGifPicker(!showGifPicker); setShowEmojiPicker(false); setShowStickerPicker(false); };
    const toggleSticker = () => { setShowStickerPicker(!showStickerPicker); setShowEmojiPicker(false); setShowGifPicker(false); };

    // Socket: Gửi sự kiện "đang gõ phím"
    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setText(e.target.value);
        if (!activeConversationId || !user) return;

        socket.send(`/app/chat/typing`, { conversationId: activeConversationId, senderId: user.id, isTyping: true });
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.send(`/app/chat/typing`, { conversationId: activeConversationId, senderId: user.id, isTyping: false });
        }, 2500);
    };

    return {
        theme, text, setText,
        showEmojiPicker, showGifPicker, showStickerPicker,
        selectedFile, setSelectedFile,
        replyingTo, setReplyingTo, editingMessage, setEditingMessage,
        emojiPickerRef, recorder,
        handleSend, handleSendGif, handleSendSticker, handleStopRecording,
        toggleEmoji, toggleGif, toggleSticker, handleTextChange
    };
};