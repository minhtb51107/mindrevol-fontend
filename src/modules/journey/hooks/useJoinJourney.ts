import { useState } from 'react';
import { journeyService } from '../services/journey.service';

export const useJoinJourney = (onSuccess?: () => void) => {
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async () => {
    if (!inviteCode.trim()) {
      setError("Vui lòng nhập mã mời");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    try {
      await journeyService.joinJourney({ inviteCode: inviteCode.trim() });
      if (onSuccess) onSuccess();
      setInviteCode(''); // Reset sau khi thành công
    } catch (err: any) {
      setError(err.response?.data?.message || "Mã mời không hợp lệ hoặc bạn đã tham gia rồi.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    inviteCode,
    setInviteCode,
    isLoading,
    error,
    handleJoin
  };
};