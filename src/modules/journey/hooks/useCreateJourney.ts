import { useMutation, useQueryClient } from '@tanstack/react-query'; // [Mới] Import React Query
import { CreateJourneyRequest } from '../types';
import { journeyService } from '../services/journey.service';
import { trackEvent } from '@/lib/analytics';
import { toast } from 'react-hot-toast'; // [Khuyên dùng] Nên dùng toast thay cho alert

export const useCreateJourney = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient(); // [Mới] Hook để quản lý cache

  const { mutate: createJourney, isPending: isCreating } = useMutation({
    mutationFn: (data: CreateJourneyRequest) => journeyService.createJourney(data),
    
    onSuccess: (newJourney, variables) => {
      // ----------------------------------------------------------------
      // [FIX QUAN TRỌNG] Báo cho React Query biết dữ liệu đã cũ -> Cần tải lại ngay
      // ----------------------------------------------------------------
      // Lưu ý: Các key này phải khớp với key bạn dùng trong useJourneyList
      queryClient.invalidateQueries({ queryKey: ['journeys'] });
      queryClient.invalidateQueries({ queryKey: ['my-journeys'] }); 
      
      // [Analytics] Logic đo lường cũ
      trackEvent('journey_created', {
        journey_id: newJourney.id,
        journey_name: variables.name,
        is_public: variables.visibility === 'PUBLIC',
        has_date_range: !!variables.endDate
      });

      // Gọi callback đóng modal/chuyển trang
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },

    onError: (error: any) => {
      console.error("Create journey error:", error);
      const message = error.response?.data?.message || "Lỗi khi tạo hành trình";
      
      // Dùng toast nhìn chuyên nghiệp hơn alert
      toast.error(message);
    }
  });

  return {
    createJourney, // Hàm này giờ là function của useMutation
    isCreating     // Trạng thái loading tự động từ useMutation
  };
};