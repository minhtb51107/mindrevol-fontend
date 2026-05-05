import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FloatingReactionProps {
    id: number;
    emoji: string;
    xOffset: number;
}

// Gọi hàm này từ component cha để trigger hiệu ứng
export const useFloatingReactions = () => {
    const [reactions, setReactions] = useState<FloatingReactionProps[]>([]);

    const triggerReaction = useCallback((emoji: string) => {
        const newReaction = {
            id: Date.now(),
            emoji,
            // Random vị trí bay lên để không bị chồng chéo (từ -20px đến 20px)
            xOffset: (Math.random() - 0.5) * 40, 
        };
        setReactions((prev) => [...prev, newReaction]);

        // Tự động dọn dẹp khỏi DOM sau 2 giây (thời gian animation)
        setTimeout(() => {
            setReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
        }, 2000);
    }, []);

    return { reactions, triggerReaction };
};

export const FloatingReactionsContainer: React.FC<{ reactions: FloatingReactionProps[] }> = ({ reactions }) => {
    return (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-full h-[300px] pointer-events-none z-50 flex justify-center items-end overflow-visible">
            <AnimatePresence>
                {reactions.map((reaction) => (
                    <motion.div
                        key={reaction.id}
                        initial={{ opacity: 0, y: 0, x: 0, scale: 0.5 }}
                        animate={{ 
                            opacity: [0, 1, 1, 0], 
                            y: -250 - Math.random() * 50, // Bay lên ngẫu nhiên độ cao
                            x: reaction.xOffset,           // Lắc lư sang trái phải
                            scale: [0.5, 1.2, 1],
                            rotate: (Math.random() - 0.5) * 30 // Xoay nhẹ
                        }}
                        exit={{ opacity: 0, transition: { duration: 0.2 } }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        className="absolute text-[2.5rem] drop-shadow-lg"
                    >
                        {reaction.emoji}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};