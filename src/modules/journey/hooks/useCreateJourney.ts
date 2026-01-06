import { useState } from 'react';
import { CreateJourneyRequest } from '../types';
import { journeyService } from '../services/journey.service';
import { trackEvent } from '@/lib/analytics'; // [Analytics] Import

export const useCreateJourney = (onSuccess?: () => void) => {
  const [isCreating, setIsCreating] = useState(false);

  const createJourney = async (data: CreateJourneyRequest) => {
    setIsCreating(true);
    try {
      // Lưu lại response để lấy ID hành trình cho analytics
      const newJourney = await journeyService.createJourney(data);
      
      // [Analytics] Đo lường: User đã tạo hành trình thành công
      trackEvent('journey_created', {
        journey_id: newJourney.id,
        journey_name: data.name,
        is_public: data.visibility === 'PUBLIC',
        has_date_range: !!data.endDate
      });

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