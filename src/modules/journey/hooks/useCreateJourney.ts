// src/modules/journey/hooks/useCreateJourney.ts
import { useState } from 'react';
import { 
  CreateJourneyRequest, 
  JourneyType, 
  JourneyVisibility, 
  InteractionType 
} from '../types';
import { journeyService } from '../services/journey.service';

const getLocalDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const useCreateJourney = (onSuccess?: () => void, onClose?: () => void) => {
  // Chỉ còn 1 bước duy nhất
  const currentStepIdx = 0; 
  const [isLoading, setIsLoading] = useState(false);
  
  // Thiết lập giá trị mặc định cho các trường đã bị ẩn khỏi UI
  const [formData, setFormData] = useState<CreateJourneyRequest>({
    name: '',
    description: '',
    startDate: getLocalDateString(),
    endDate: '',
    // --- Các giá trị mặc định (Hardcoded) ---
    type: JourneyType.CHALLENGE, // Mặc định là Challenge
    theme: '#6366f1',            // Màu tím mặc định
    visibility: JourneyVisibility.PUBLIC, 
    interactionType: InteractionType.GROUP_DISCUSS
  });

  const updateFormData = (updates: Partial<CreateJourneyRequest>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Hàm xử lý tạo mới (Submit trực tiếp)
  const submitForm = async () => {
    // 1. Validate đơn giản
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên hành trình");
      return;
    }

    // 2. Gọi API
    setIsLoading(true);
    try {
      await journeyService.createJourney(formData);
      
      // 3. Xử lý thành công
      if (onSuccess) onSuccess();
      resetForm();
      if (onClose) onClose();
      
    } catch (error: any) {
      console.error("Create journey error:", error);
      alert(error.response?.data?.message || "Lỗi khi tạo hành trình");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      startDate: getLocalDateString(),
      endDate: '',
      type: JourneyType.CHALLENGE,
      theme: '#6366f1',
      visibility: JourneyVisibility.PUBLIC,
      interactionType: InteractionType.GROUP_DISCUSS
    });
  };

  // Không cần nextStep/prevStep nữa vì chỉ có 1 màn hình
  return {
    currentStepIdx,
    formData,
    isLoading,
    updateFormData,
    submitForm, // Thay nextStep bằng submitForm
    resetForm
  };
};