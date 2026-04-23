import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { boxService } from '../services/box.service';
import { fileService } from '@/modules/storage/services/file.service';
import { BoxDetailResponse, UpdateBoxRequest } from '../types';

export const useUpdateBox = (isOpen: boolean, onClose: () => void, onSuccess: () => void, boxData: BoxDetailResponse) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [avatarImage, setAvatarImage] = useState<string | null>(null); 
    const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [bgFile, setBgFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && boxData) {
            setName(boxData.name || '');
            setDescription(boxData.description || '');
            const isAvatarUrl = boxData.avatar?.includes('/') || boxData.avatar?.startsWith('http') || boxData.avatar?.startsWith('blob:');
            setAvatarImage(isAvatarUrl ? boxData.avatar : null);
            setAvatarFile(null); 
            const isThemeUrl = boxData.themeSlug?.includes('/') || boxData.themeSlug?.startsWith('http') || boxData.themeSlug?.startsWith('blob:');
            setBackgroundImage(isThemeUrl ? boxData.themeSlug : null);
            setBgFile(null); 
            setError('');
        }
    }, [isOpen, boxData]);

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
            let finalAvatarUrl = avatarImage || boxData.avatar || "📦";
            let finalThemeUrl = backgroundImage || boxData.themeSlug || 'default';

            if (avatarFile) finalAvatarUrl = await fileService.uploadFile(avatarFile);
            if (bgFile) finalThemeUrl = await fileService.uploadFile(bgFile);
            
            const payload: UpdateBoxRequest = { 
                name: name.trim(), description: description.trim(), 
                themeSlug: finalThemeUrl, avatar: finalAvatarUrl   
            };
            await boxService.updateBox(boxData.id, payload);
            toast.success("Cập nhật Không gian thành công!");
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err?.response?.data?.message || 'Có lỗi xảy ra khi cập nhật.');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        name, setName, description, setDescription,
        avatarImage, backgroundImage, isLoading, error,
        handleFileUpload, handleSubmit
    };
};