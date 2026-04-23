import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { userService } from '../services/user.service';

export const useSettingsModal = (onClose: () => void) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { theme, setTheme } = useTheme();

    const [showEditProfile, setShowEditProfile] = useState(false);
    const [showSecurity, setShowSecurity] = useState(false);
    const [showNotifSettings, setShowNotifSettings] = useState(false);
    const [showBlockedUsers, setShowBlockedUsers] = useState(false);
    const [showFeedbackInput, setShowFeedbackInput] = useState(false);
    const [feedbackText, setFeedbackText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const handleSendFeedback = async () => {
        if(!feedbackText.trim()) return;
        try {
            await userService.sendFeedback({ type: 'GENERAL', content: feedbackText });
            alert("Thanks for your feedback!");
            setFeedbackText('');
            setShowFeedbackInput(false);
        } catch (e) {
            alert("Something went wrong. Please try again later.");
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm("WARNING: This action will permanently delete your account. Are you sure?")) return;
        if (!confirm("Your data cannot be restored after deletion. Continue deleting the account?")) return;

        setIsDeleting(true);
        try {
            await userService.deleteAccount();
            alert("Your account has been deleted successfully.");
            logout(); 
            onClose();
        } catch (e) {
            alert("Failed to delete the account. Please try again later.");
            setIsDeleting(false);
        }
    };

    return {
        user, logout, navigate, theme, setTheme,
        showEditProfile, setShowEditProfile,
        showSecurity, setShowSecurity,
        showNotifSettings, setShowNotifSettings,
        showBlockedUsers, setShowBlockedUsers,
        showFeedbackInput, setShowFeedbackInput,
        feedbackText, setFeedbackText,
        isDeleting, handleSendFeedback, handleDeleteAccount
    };
};

export const useNotificationSettings = (isOpen: boolean) => {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            userService.getNotificationSettings()
                .then(res => setSettings(res))
                .catch(err => console.error("Failed to load notification settings", err))
                .finally(() => setLoading(false));
        }
    }, [isOpen]);

    const handleToggle = async (field: string, checked: boolean) => {
        setSettings((prev: any) => ({ ...prev, [field]: checked }));
        try {
            await userService.updateNotificationSettings({ [field]: checked });
        } catch (e) {
            setSettings((prev: any) => ({ ...prev, [field]: !checked }));
            alert("Unable to save settings. Please try again.");
        }
    };

    return { settings, loading, handleToggle };
};