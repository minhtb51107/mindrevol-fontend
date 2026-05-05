// src/config/tourConfig.ts
import { Step } from 'react-joyride';

export const TOUR_STEPS: Record<string, Step[]> = {
  HOME: [
    {
      target: 'body',
      content: 'Chào mừng bạn đến với MindRevol! Hãy dành 1 phút để làm quen với các tính năng chính nhé 🎉',
      placement: 'center', // Bảng thông báo sẽ nằm giữa màn hình
    },
    {
      target: '[data-tour="create-journey"]',
      content: 'Bấm vào đây để tạo Hành trình (Journey) mới. Đây là nơi bạn bắt đầu lưu giữ mọi khoảnh khắc đáng nhớ.',
    },
    {
      target: '[data-tour="streak-flame"]',
      content: 'Giữ lửa mỗi ngày! Hãy check-in thường xuyên để chuỗi ngày (Streak) của bạn không bị tắt 🔥',
    },
    {
      target: '[data-tour="archive"]',
      content: 'Kho lưu trữ: Nơi cất giữ những kỷ niệm bạn đã lưu lại hoặc các hành trình đã hoàn thành.',
    }
  ],
  
  MAP: [
    {
      target: '[data-tour="map-mode"]',
      content: 'Bạn có thể chuyển đổi giữa xem Từng Điểm (Marker) hoặc xem Bản đồ Nhiệt (Heatmap) để thấy nơi nào bạn hoạt động sôi nổi nhất 🗺️',
    },
    {
      target: '[data-tour="ghost-mode"]',
      content: 'Quyền riêng tư là trên hết! Bật Chế độ Tàng hình (Ghost Mode) để làm mờ vị trí hoặc ẩn hoàn toàn khỏi bản đồ của bạn bè 👻',
    }
  ],

  MOOD: [
    {
      target: '[data-tour="mood-mascot"]',
      content: 'Mascot đại diện cho cảm xúc của bạn hôm nay. Bấm vào đây để thay đổi trạng thái và lời nhắn nhé! ✨',
    },
    {
      target: '[data-tour="mood-social-hub"]',
      content: 'Không chỉ là cảm xúc, bạn có thể gắn kèm Bài hát đang nghe trên Spotify, Hoạt động hiện tại và cả Thời tiết 🎵☕',
    }
  ],

  GRID_FEED: [
    {
      target: '[data-tour="global-recap"]',
      content: 'Tuyệt chiêu cuối: Bấm vào đây để hệ thống tổng hợp các bức ảnh của bạn thành một Thước phim Recap cực xịn xò 🎬',
    }
  ]
};