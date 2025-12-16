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
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Tổng số bước: Type (0) -> Info (1) -> Settings (2)
  const TOTAL_STEPS = 3; 

  const [formData, setFormData] = useState<CreateJourneyRequest>({
    type: JourneyType.CHALLENGE,
    name: '',
    description: '',
    startDate: getLocalDateString(),
    endDate: '',
    theme: '#6366f1',
    visibility: JourneyVisibility.PUBLIC,
    interactionType: InteractionType.GROUP_DISCUSS
  });

  const updateFormData = (updates: Partial<CreateJourneyRequest>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStepIdx < TOTAL_STEPS - 1) {
      setCurrentStepIdx(prev => prev + 1);
    } else {
      submitForm();
    }
  };

  const prevStep = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx(prev => prev - 1);
    }
  };

  const submitForm = async () => {
    // 1. Validate Logic
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên hành trình"); // Bạn có thể thay bằng Toast notification
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
      type: JourneyType.CHALLENGE,
      name: '',
      description: '',
      startDate: getLocalDateString(),
      endDate: '',
      theme: '#6366f1',
      visibility: JourneyVisibility.PUBLIC,
      interactionType: InteractionType.GROUP_DISCUSS
    });
    setCurrentStepIdx(0);
  };

  return {
    currentStepIdx,
    formData,
    isLoading,
    updateFormData,
    nextStep,
    prevStep,
    resetForm
  };
};