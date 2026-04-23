import { useState, useEffect } from 'react';
import { MoodRequest } from '../types';

export const useMoodForm = (
    isOpen: boolean,
    onClose: () => void,
    onSubmit: (data: MoodRequest) => Promise<void>,
    initialIcon?: string,
    initialMessage?: string,
    defaultIcon: string = "😆"
) => {
    const [icon, setIcon] = useState(initialIcon || defaultIcon);
    const [message, setMessage] = useState(initialMessage || "");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIcon(initialIcon || defaultIcon);
            setMessage(initialMessage || "");
        }
    }, [isOpen, initialIcon, initialMessage, defaultIcon]);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await onSubmit({ icon, message });
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return {
        icon, setIcon,
        message, setMessage,
        loading, handleSubmit
    };
};