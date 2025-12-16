import { useState, useEffect } from 'react';
import { journeyService } from '../services/journey.service';
import { JourneyParticipantResponse } from '../types';

export const useTransferOwnership = (journeyId: string, currentUserId: number, onSuccess: () => void) => {
  const [members, setMembers] = useState<JourneyParticipantResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load thành viên để chọn (Trừ chính mình ra)
  useEffect(() => {
    const loadMembers = async () => {
      setIsLoading(true);
      try {
        const list = await journeyService.getParticipants(journeyId);
        // Lọc bỏ chính mình (Chủ phòng hiện tại)
        const eligibleMembers = list.filter(m => m.userId !== currentUserId);
        setMembers(eligibleMembers);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMembers();
  }, [journeyId, currentUserId]);

  const handleTransfer = async (newOwnerId: number) => {
    if (!window.confirm("Bạn chắc chắn muốn chuyển quyền chủ phòng cho thành viên này? Bạn sẽ trở thành thành viên thường.")) {
      return;
    }

    setIsSubmitting(true);
    try {
      await journeyService.transferOwnership(journeyId, newOwnerId);
      onSuccess(); // Thường là đóng modal và refresh lại list
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi chuyển quyền");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { members, isLoading, isSubmitting, handleTransfer };
};