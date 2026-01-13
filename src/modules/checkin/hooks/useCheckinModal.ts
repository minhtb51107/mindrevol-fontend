import { useState, useEffect, useRef } from 'react';
import { checkinService } from '@/modules/checkin/services/checkin.service';
import imageCompression from 'browser-image-compression';
import { Emotion } from '@/modules/feed/types';
import { trackEvent } from '@/lib/analytics';

// --- DEFINITIONS ---
export enum UIActivityType {
  LEARNING = 'LEARNING',
  WORKING = 'WORKING',
  EXERCISING = 'EXERCISING',
  CHILLING = 'CHILLING',
  EATING = 'EATING',
  DATING = 'DATING',
  GAMING = 'GAMING',
  TRAVELING = 'TRAVELING',
  READING = 'READING',
  CREATING = 'CREATING',
  CUSTOM = 'CUSTOM'
}

export const ACTIVITY_PRESETS = [
  { type: UIActivityType.LEARNING, label: 'Học bài', emoji: '📚', color: 'bg-blue-600' },
  { type: UIActivityType.WORKING, label: 'Làm việc', emoji: '💼', color: 'bg-slate-600' },
  { type: UIActivityType.EXERCISING, label: 'Tập gym', emoji: '💪', color: 'bg-orange-600' },
  { type: UIActivityType.CHILLING, label: 'Chill', emoji: '🌿', color: 'bg-emerald-600' },
  { type: UIActivityType.EATING, label: 'Ăn uống', emoji: '🍜', color: 'bg-yellow-600' },
  { type: UIActivityType.DATING, label: 'Hẹn hò', emoji: '💕', color: 'bg-pink-600' },
  { type: UIActivityType.GAMING, label: 'Game', emoji: '🎮', color: 'bg-purple-600' },
  { type: UIActivityType.TRAVELING, label: 'Du lịch', emoji: '✈️', color: 'bg-sky-500' },
  { type: UIActivityType.READING, label: 'Đọc sách', emoji: '📖', color: 'bg-amber-700' },
  { type: UIActivityType.CREATING, label: 'Sáng tạo', emoji: '🎨', color: 'bg-rose-500' },
];

const mapEmojiToEmotion = (emoji: string): Emotion => {
  return Emotion.NORMAL; // Logic map đơn giản
};

interface UseCheckinModalProps {
  file: File | null;
  journeyId: string;
  onSuccess: () => void;
  onClose: () => void;
}

export const useCheckinModal = ({ file, journeyId, onSuccess, onClose }: UseCheckinModalProps) => {
  // --- STATES ---
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(ACTIVITY_PRESETS[0]);
  const [customContext, setCustomContext] = useState('');
  const [moodEmoji, setMoodEmoji] = useState('✨');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Drag Scroll Refs
  const scrollRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // --- EFFECTS ---
  
  // 1. Tạo Preview URL từ File
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  // 2. Click Outside để đóng Emoji Picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- HANDLERS (DRAG SCROLL) ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleMouseLeave = () => setIsDragging(false);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  // --- HANDLER (SUBMIT) ---
  const handleSubmit = async () => {
    if (!file) return;
    
    try {
      setIsSubmitting(true);
      
      // Nén ảnh nếu lớn hơn 1MB
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true, fileType: 'image/jpeg' };
      let fileToUpload = file;
      if (file.size > 1024 * 1024) {
        try { fileToUpload = await imageCompression(file, options); } catch (e) { console.warn(e); }
      }

      const isCustom = !!customContext;
      const finalEmotion = mapEmojiToEmotion(moodEmoji);
      const finalActivityType = isCustom ? UIActivityType.CUSTOM : selectedActivity.type;

      // Gọi Service
      await checkinService.createCheckin({
        file: fileToUpload,
        journeyId: journeyId,
        caption: caption,
        emotion: finalEmotion,
        activityType: finalActivityType,
        activityName: isCustom ? customContext : selectedActivity.label,
        locationName: location,
        statusRequest: 'NORMAL'
      });
      
      // Analytics
      trackEvent('checkin_completed', {
        journey_id: journeyId,
        has_photo: true,
        word_count: caption.trim().split(/\s+/).length,
        emotion_emoji: moodEmoji,
        activity_type: finalActivityType,
        has_location: !!location
      });
      
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(error);
      alert("Lỗi khi đăng bài: " + (error.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // Data States
    caption, setCaption,
    location, setLocation,
    selectedActivity, setSelectedActivity,
    customContext, setCustomContext,
    moodEmoji, setMoodEmoji,
    previewUrl,
    
    // UI States
    isSubmitting,
    showEmojiPicker, setShowEmojiPicker,
    
    // Refs
    scrollRef,
    pickerRef,
    
    // Handlers
    dragHandlers: {
        onMouseDown: handleMouseDown,
        onMouseLeave: handleMouseLeave,
        onMouseUp: handleMouseUp,
        onMouseMove: handleMouseMove
    },
    handleSubmit
  };
};