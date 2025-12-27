import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { journeyService } from '../services/journey.service';
import { JourneyInvitationResponse } from '../types';

export const useJourneyInvitations = (onActionSuccess?: () => void) => {
  const [invitations, setInvitations] = useState<JourneyInvitationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchInvitations = useCallback(async () => {
    try {
      const data = await journeyService.getMyPendingInvitations();
      setInvitations(data);
    } catch (error) {
      console.error("Failed to load invitations", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvitations();
  }, [fetchInvitations]);

  const handleAccept = async (invitationId: number) => {
    setProcessingId(invitationId);
    try {
      await journeyService.acceptInvitation(invitationId);
      toast.success("Đã chấp nhận lời mời! 🚀");
      
      // Xóa lời mời khỏi danh sách local
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      
      // Gọi callback để refresh danh sách hành trình chính bên ngoài
      if (onActionSuccess) onActionSuccess();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (invitationId: number) => {
    setProcessingId(invitationId);
    try {
      await journeyService.rejectInvitation(invitationId);
      toast.success("Đã từ chối lời mời.");
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
    } catch (error) {
      toast.error("Có lỗi xảy ra");
    } finally {
      setProcessingId(null);
    }
  };

  return {
    invitations,
    isLoading,
    processingId,
    handleAccept,
    handleReject,
    refresh: fetchInvitations
  };
};