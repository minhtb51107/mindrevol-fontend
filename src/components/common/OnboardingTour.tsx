import React, { useEffect } from 'react';
import { Joyride } from 'react-joyride'; 
import { userService } from '@/modules/user/services/user.service';
import { useAuth } from '@/modules/auth/store/AuthContext';

export const OnboardingTour = () => {
  const { user, refreshProfile } = useAuth();

  // 1. NHẬN DIỆN TÂN THỦ THỰC SỰ: Cờ onboarding = false VÀ chưa từng có bài viết nào
  const isTrulyNewUser = !!user && !user.hasCompletedOnboarding && (user.totalCheckins || 0) === 0;

  // 2. XỬ LÝ USER CŨ: Nếu là user cũ (đã có bài viết) nhưng cờ vẫn = false (do mới update Database)
  // -> Âm thầm gọi API đánh dấu hoàn thành để gỡ cờ, không hiển thị Tour cho họ
  useEffect(() => {
    if (user && !user.hasCompletedOnboarding && (user.totalCheckins || 0) > 0) {
      userService.completeOnboarding().then(() => refreshProfile());
    }
  }, [user, refreshProfile]);

  // Thiết lập các bước hướng dẫn (Chỉ trỏ vào những thành phần chắc chắn 100% luôn xuất hiện trên màn hình)
  const steps = [
    {
      target: 'body',
      content: 'Chào mừng bạn đến với MindRevol! Hãy dành 1 phút để làm quen với ứng dụng nhé 🎉',
      placement: 'center' as const,
      disableBeacon: true,
    },
    {
      // Class .step-create-journey này bạn nhớ gắn vào nút "Tạo hành trình" ở file Navigation (thanh menu)
      target: '.step-create-journey', 
      content: 'Bấm vào đây để tạo Hành trình (Journey) mới. Đây là nơi bạn bắt đầu lưu giữ mọi khoảnh khắc đáng nhớ.',
      disableBeacon: true,
    }
  ];

  const handleJoyrideEvent = async (data: any) => {
    const { status } = data;
    const finishedStatuses = ['finished', 'skipped'];

    if (finishedStatuses.includes(status)) {
      try {
        await userService.completeOnboarding();
        await refreshProfile(); 
      } catch (error) {
        console.error("Lỗi khi update trạng thái onboarding", error);
      }
    }
  };

  // Nếu không phải tân thủ thực sự -> Không render gì cả
  if (!isTrulyNewUser) return null;

  return (
    <Joyride
      steps={steps}
      run={isTrulyNewUser}
      continuous={true}
      scrollToFirstStep={true}
      onEvent={handleJoyrideEvent} 
      options={{
        buttons: ['back', 'close', 'primary', 'skip'], 
        primaryColor: '#1A1A1A',
        zIndex: 10000,
      }}
      styles={{
        tooltip: {
            borderRadius: '24px',
            fontFamily: 'Quicksand, sans-serif',
            padding: '20px',
        },
        buttonPrimary: {
            borderRadius: '12px',
            fontWeight: 'bold',
            color: '#FFFFFF'
        },
        buttonBack: {
            marginRight: '10px',
            color: '#1A1A1A'
        },
        buttonSkip: {
            color: '#8A8580',
            fontWeight: 'bold'
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)'
        }
      }}
      locale={{
        back: 'Quay lại',
        close: 'Đóng',
        last: 'Bắt đầu ngay',
        next: 'Tiếp theo',
        skip: 'Bỏ qua',
      }}
    />
  );
};