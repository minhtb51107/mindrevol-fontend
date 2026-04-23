import { useState, useRef, useEffect } from 'react';
import { userService, UserProfile } from '../services/user.service';
import { useAuth } from '@/modules/auth/store/AuthContext';

export const useEditProfile = (
    isOpen: boolean, 
    user: UserProfile, 
    onClose: () => void, 
    onUpdateSuccess: () => void
) => {
    const { refreshProfile } = useAuth();
    const [fullname, setFullname] = useState(user.fullname);
    const [bio, setBio] = useState(user.bio || '');
    
    const [previewAvatar, setPreviewAvatar] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFullname(user.fullname);
            setBio(user.bio || '');
            setPreviewAvatar(null);
            setFile(null);
        }
    }, [isOpen, user]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            setFile(f);
            setPreviewAvatar(URL.createObjectURL(f));
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            await userService.updateProfile({
                fullname,
                bio,
                avatar: file || undefined,
            });
            await refreshProfile(); 
            onUpdateSuccess();
            onClose();
        } catch (error) {
            alert('Update failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        fullname, setFullname,
        bio, setBio,
        previewAvatar,
        fileInputRef,
        isLoading,
        handleFileChange,
        handleSubmit
    };
};