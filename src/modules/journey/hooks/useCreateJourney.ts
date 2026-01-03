import { useState } from 'react';
import { CreateJourneyRequest } from '../types';
import { journeyService } from '../services/journey.service';

export const useCreateJourney = (onSuccess?: () => void) => {
  const [isCreating, setIsCreating] = useState(false);

  const createJourney = async (data: CreateJourneyRequest) => {
    setIsCreating(true);
    try {
      await journeyService.createJourney(data);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Create journey error:", error);
      // Hiển thị thông báo lỗi từ server trả về
      alert(error.response?.data?.message || "Lỗi khi tạo hành trình");
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createJourney, // Hàm này nhận data: CreateJourneyRequest
    isCreating     // Trạng thái loading
  };
};