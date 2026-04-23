import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { boxService } from '../services/box.service';
import { fileService } from '@/modules/storage/services/file.service';
import { friendService } from '@/modules/user/services/friend.service';

export const useCreateBox = (isOpen: boolean, onClose: () => void, onSuccess: () => void) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [avatarImage, setAvatarImage] = useState<string | null>(null); 
    const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [bgFile, setBgFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [friends, setFriends] = useState<any[]>([]);
    const [selectedFriends, setSelectedFriends] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName(''); setDescription('');
            setAvatarImage(null); setBackgroundImage(null);
            setAvatarFile(null); setBgFile(null);    
            setSearchQuery(''); setSelectedFriends([]);
            setError('');
            fetchFriends();
        }
    }, [isOpen]);

    const fetchFriends = async () => {
        try {
            const res = await friendService.getMyFriends();
            setFriends((res || []).map((item: any) => item.friend));
        } catch (e) {
            console.error("Lỗi tải danh sách bạn bè", e);
        }
    };

    const filteredFriends = useMemo(() => {
        const unselected = friends.filter(f => !selectedFriends.some(s => s.id === f.id));
        if (!searchQuery.trim()) return unselected;
        return unselected.filter(f => 
            f.fullname.toLowerCase().includes(searchQuery.toLowerCase()) || 
            (f.handle && f.handle.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [friends, selectedFriends, searchQuery]);

    const handleAddFriend = (friend: any) => {
        setSelectedFriends(prev => [...prev, friend]);
        setSearchQuery('');
    };

    const handleRemoveFriend = (friendId: string) => {
        setSelectedFriends(prev => prev.filter(f => f.id !== friendId));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'bg') => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file); 
            if (type === 'avatar') {
                setAvatarImage(url); setAvatarFile(file); 
            } else {
                setBackgroundImage(url); setBgFile(file);    
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return setError('Tên Box không được để trống.');
        
        try {
            setIsLoading(true);
            let finalAvatarUrl = avatarImage || "📦";
            let finalThemeUrl = backgroundImage || 'default';

            if (avatarFile) finalAvatarUrl = await fileService.uploadFile(avatarFile);
            if (bgFile) finalThemeUrl = await fileService.uploadFile(bgFile);
            
            await boxService.createBox({ 
                name: name.trim(), description: description.trim(), 
                themeSlug: finalThemeUrl, avatar: finalAvatarUrl,
                textPosition: '50,50', inviteUserIds: selectedFriends.map(f => f.id)
            });
            
            toast.success("Tạo Box thành công!");
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Có lỗi xảy ra khi tạo Box.');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        name, setName, description, setDescription,
        avatarImage, backgroundImage, isLoading, error,
        searchQuery, setSearchQuery, selectedFriends, filteredFriends,
        handleAddFriend, handleRemoveFriend, handleFileUpload, handleSubmit
    };
};