// src/components/common/GlobalTourManager.tsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Joyride } from 'react-joyride';
import { TOUR_STEPS } from '@/config/tourConfig';
import { useAuth } from '@/modules/auth/store/AuthContext';
import { userService } from '@/modules/user/services/user.service';

export const GlobalTourManager = () => {
  const { user, refreshProfile } = useAuth();
  const location = useLocation();
  const [currentSteps, setCurrentSteps] = useState<any[]>([]);
  const [runTour, setRunTour] = useState(false);
  const [tourName, setTourName] = useState('');

  useEffect(() => {
    if (!user) return;

    // 1. KIỂM TRA TRANG CHỦ (Core Onboarding)
    if (location.pathname === '/' && !user.hasCompletedOnboarding && (user.totalCheckins || 0) === 0) {
      setCurrentSteps(TOUR_STEPS.HOME);
      setTourName('HOME');
      setRunTour(true);
      return;
    }

    // 2. KIỂM TRA TRANG MAP (Lưu local)
    if (location.pathname.startsWith('/map')) {
      const seenMap = localStorage.getItem('tour_seen_map');
      if (!seenMap) {
        // Delay 1 chút chờ Map render xong
        setTimeout(() => {
          setCurrentSteps(TOUR_STEPS.MAP);
          setTourName('MAP');
          setRunTour(true);
        }, 1000);
      }
      return;
    }

    // 3. KIỂM TRA TRANG MOOD
    if (location.pathname.includes('/moods')) {
      const seenMood = localStorage.getItem('tour_seen_mood');
      if (!seenMood) {
        setTimeout(() => {
          setCurrentSteps(TOUR_STEPS.MOOD);
          setTourName('MOOD');
          setRunTour(true);
        }, 1000);
      }
      return;
    }

    // 4. KIỂM TRA TRANG GRID FEED (Tạo Recap)
    if (location.pathname === '/journeys/grid') {
      const seenGrid = localStorage.getItem('tour_seen_grid');
      if (!seenGrid && (user.totalCheckins || 0) > 0) {
        setTimeout(() => {
          setCurrentSteps(TOUR_STEPS.GRID_FEED);
          setTourName('GRID_FEED');
          setRunTour(true);
        }, 500);
      }
      return;
    }

    // Nếu không khớp hoặc đã xem, tắt tour
    setRunTour(false);

  }, [location.pathname, user]);

  const handleJoyrideEvent = async (data: any) => {
    const { status } = data;
    if (['finished', 'skipped'].includes(status)) {
      setRunTour(false);

      if (tourName === 'HOME') {
        await userService.completeOnboarding();
        await refreshProfile();
      } else {
        // Lưu các tour lẻ vào localStorage
        localStorage.setItem(`tour_seen_${tourName.toLowerCase()}`, 'true');
      }
    }
  };

  if (!runTour || currentSteps.length === 0) return null;

  return (
    <Joyride
      steps={currentSteps}
      run={runTour}
      continuous={true}
      scrollToFirstStep={true}
      onEvent={handleJoyrideEvent}
      options={{
        buttons: ['back', 'close', 'primary', 'skip'],
        primaryColor: '#1A1A1A',
        zIndex: 10000,
      }}
      styles={{
        tooltip: { borderRadius: '24px', fontFamily: 'Quicksand, sans-serif', padding: '20px' },
        buttonPrimary: { borderRadius: '12px', fontWeight: 'bold', color: '#FFFFFF' },
        buttonBack: { marginRight: '10px', color: '#1A1A1A' },
        buttonSkip: { color: '#8A8580', fontWeight: 'bold' },
        overlay: { backgroundColor: 'rgba(0, 0, 0, 0.6)' }
      }}
      locale={{ back: 'Quay lại', close: 'Đóng', last: 'Hoàn thành', next: 'Tiếp theo', skip: 'Bỏ qua' }}
    />
  );
};