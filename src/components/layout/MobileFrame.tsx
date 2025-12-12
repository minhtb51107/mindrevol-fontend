import React from 'react';

interface MobileFrameProps {
  children: React.ReactNode;
}

const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  return (
    // Container ngoài cùng: Full màn hình, màu đen, căn giữa
    <div className="min-h-screen w-full bg-black flex justify-center items-center overflow-hidden">
      
      {/* Khung Mobile: Max-width 430px (cỡ iPhone Pro Max), Chiều cao full */}
      <div className="w-full max-w-[430px] h-[100dvh] relative bg-background shadow-2xl overflow-hidden flex flex-col">
        
        {/* Nội dung App sẽ nằm trong đây */}
        <main className="flex-1 overflow-y-auto relative">
          {children}
        </main>

      </div>
    </div>
  );
};

export default MobileFrame;