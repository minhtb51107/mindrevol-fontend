// src/modules/journey/hooks/useJourneyList.ts
import { useState, useEffect, useCallback } from 'react';
import { JourneyResponse } from '../types';
import { journeyService } from '../services/journey.service';

export const useJourneyList = () => {
  const [data, setData] = useState<JourneyResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJourneys = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const journeys = await journeyService.getMyJourneys();
      setData(journeys);
    } catch (err: any) {
      console.error("Fetch journeys failed:", err);
      setError(err.response?.data?.message || "Không thể tải danh sách hành trình.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Tự động fetch khi hook được gọi lần đầu
  useEffect(() => {
    fetchJourneys();
  }, [fetchJourneys]);

  return {
    data,
    isLoading,
    error,
    refresh: fetchJourneys // Hàm này dùng để gọi lại API khi cần (vd: sau khi tạo mới)
  };
};