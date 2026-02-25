import { useState, useEffect, useRef, useCallback } from 'react';
import { checkinService } from '@/modules/checkin/services/checkin.service';
import { journeyService } from '@/modules/journey/services/journey.service'; 
import { UserActiveJourneyResponse } from '@/modules/journey/types'; 
import imageCompression from 'browser-image-compression';
import { Emotion } from '@/modules/feed/types';
import { trackEvent } from '@/lib/analytics';

// --- HÀM HỖ TRỢ CẮT ẢNH (CANVAS) ---
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<File | null> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(new File([blob], 'cropped_image.jpg', { type: 'image/jpeg' }));
      } else {
        resolve(null);
      }
    }, 'image/jpeg', 0.95);
  });
};

// --- DEFINITIONS ---
export enum UIActivityType {
  LEARNING = 'LEARNING', WORKING = 'WORKING', EXERCISING = 'EXERCISING',
  CHILLING = 'CHILLING', EATING = 'EATING', DATING = 'DATING',
  GAMING = 'GAMING', TRAVELING = 'TRAVELING', READING = 'READING',
  CREATING = 'CREATING', CUSTOM = 'CUSTOM'
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

const mapEmojiToEmotion = (emoji: string): Emotion => Emotion.NORMAL;

interface UseCheckinModalProps {
  file: File | null;
  journeyId: string;
  onSuccess: () => void;
  onClose: () => void;
}

export const useCheckinModal = ({ file, journeyId, onSuccess, onClose }: UseCheckinModalProps) => {
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(ACTIVITY_PRESETS[0]);
  const [customContext, setCustomContext] = useState('');
  const [moodEmoji, setMoodEmoji] = useState('✨');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // --- [MỚI] STATES QUẢN LÝ CHỌN HÀNH TRÌNH ---
  const [activeJourneys, setActiveJourneys] = useState<UserActiveJourneyResponse[]>([]);
  const [selectedJourneyId, setSelectedJourneyId] = useState<string>(journeyId);
  const [isJourneyDropdownOpen, setIsJourneyDropdownOpen] = useState(false);
  const journeyDropdownRef = useRef<HTMLDivElement>(null);

  // Tải danh sách hành trình đang hoạt động
  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        const journeys = await journeyService.getUserActiveJourneys('me');
        setActiveJourneys(journeys);
        // Nếu chưa có journeyId thì chọn cái đầu tiên mặc định
        if (!selectedJourneyId && journeys.length > 0) {
            setSelectedJourneyId(journeys[0].id);
        }
      } catch (error) {
        console.error("Lỗi tải danh sách hành trình:", error);
      }
    };
    fetchJourneys();
  }, []);

  // --- CROP STATES ---
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(1); 
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  // Đóng picker/dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
      if (journeyDropdownRef.current && !journeyDropdownRef.current.contains(event.target as Node)) {
        setIsJourneyDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSubmit = async () => {
    if (!file || !previewUrl) return;
    if (!selectedJourneyId) {
        alert("Vui lòng chọn một hành trình để đăng bài!");
        return;
    }
    
    try {
      setIsSubmitting(true);
      
      let fileToUpload = file;
      if (croppedAreaPixels) {
          const croppedImage = await getCroppedImg(previewUrl, croppedAreaPixels);
          if (croppedImage) fileToUpload = croppedImage;
      }

      const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true, fileType: 'image/jpeg' };
      if (fileToUpload.size > 1024 * 1024) {
        try { fileToUpload = await imageCompression(fileToUpload, options); } catch (e) { console.warn(e); }
      }

      const isCustom = !!customContext;
      const finalEmotion = mapEmojiToEmotion(moodEmoji);
      const finalActivityType = isCustom ? UIActivityType.CUSTOM : selectedActivity.type;

      await checkinService.createCheckin({
        file: fileToUpload,
        journeyId: selectedJourneyId, // Dùng ID hành trình đã chọn
        caption: caption,
        emotion: finalEmotion,
        activityType: finalActivityType,
        activityName: isCustom ? customContext : selectedActivity.label,
        locationName: location,
        statusRequest: 'NORMAL'
      });
      
      trackEvent('checkin_completed', { journey_id: selectedJourneyId, has_photo: true });
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
    caption, setCaption, location, setLocation, selectedActivity, setSelectedActivity,
    customContext, setCustomContext, moodEmoji, setMoodEmoji, previewUrl, isSubmitting,
    showEmojiPicker, setShowEmojiPicker, scrollRef, pickerRef, handleSubmit,
    crop, setCrop, zoom, setZoom, aspect, setAspect, onCropComplete,
    
    // Xuất state ra để dùng ở UI
    activeJourneys, selectedJourneyId, setSelectedJourneyId, 
    isJourneyDropdownOpen, setIsJourneyDropdownOpen, journeyDropdownRef
  };
};