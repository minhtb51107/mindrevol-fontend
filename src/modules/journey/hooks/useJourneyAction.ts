// src/modules/journey/hooks/useJourneyAction.ts
import { useState } from 'react';
import { journeyService } from '../services/journey.service';

export const useJourneyAction = (onSuccess?: () => void) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const joinJourney = async (inviteCode: string) => {
    if (!inviteCode.trim()) return;
    setIsProcessing(true);
    try {
      await journeyService.joinJourney({ inviteCode });
      if (onSuccess) onSuccess();
      alert("Đã tham gia hành trình thành công!");
    } catch (error: any) {
      alert(error.response?.data?.message || "Mã mời không hợp lệ hoặc lỗi hệ thống.");
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteJourney = async (journeyId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa hành trình này không? Hành động này không thể hoàn tác.")) return;
    
    setIsProcessing(true);
    try {
      await journeyService.deleteJourney(journeyId);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi khi xóa hành trình.");
    } finally {
      setIsProcessing(false);
    }
  };

  const leaveJourney = async (journeyId: string) => {
    if (!window.confirm("Bạn muốn rời khỏi hành trình này?")) return;

    setIsProcessing(true);
    try {
      await journeyService.leaveJourney(journeyId);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi khi rời hành trình.");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    joinJourney,
    deleteJourney,
    leaveJourney
  };
};