import { useRef, useState, useEffect } from 'react';

export const useDraggableScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  // Xử lý scroll snap logic để update activeIndex
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const center = container.scrollLeft + container.offsetWidth / 2;
    
    // Tìm phần tử nằm giữa màn hình
    const children = Array.from(container.children) as HTMLElement[];
    let closestIndex = 0;
    let minDistance = Number.MAX_VALUE;

    children.forEach((child, index) => {
        // Bỏ qua div đệm (spacer) đầu và cuối
        if (child.classList.contains('post-card-wrapper')) {
             const childCenter = child.offsetLeft + child.offsetWidth / 2;
             const distance = Math.abs(center - childCenter);
             if (distance < minDistance) {
                 minDistance = distance;
                 // Cần trừ đi offset của spacer đầu tiên nếu có logic index phức tạp
                 // Ở đây giả định list post nằm giữa 2 spacer
                 closestIndex = index - 1; 
             }
        }
    });
    
    if (closestIndex >= 0) setActiveIndex(closestIndex);
  };

  // Attach scroll listener
  useEffect(() => {
      const el = scrollRef.current;
      if (el) {
          el.addEventListener('scroll', handleScroll, { passive: true });
          return () => el.removeEventListener('scroll', handleScroll);
      }
  }, []);

  // Mouse Handlers cho Dragging trên Desktop
  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const onMouseLeave = () => {
    setIsDragging(false);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Tốc độ scroll
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const scrollToItem = (index: number) => {
      if(!scrollRef.current) return;
      // Logic tính toán scroll to item cụ thể (User tự implement nếu cần smooth scroll chính xác)
      const children = scrollRef.current.querySelectorAll('.post-card-wrapper');
      if(children[index]) {
          children[index].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
  };

  return {
    scrollRef,
    activeIndex,
    setActiveIndex,
    isDragging,
    scrollToItem,
    handlers: {
        onMouseDown,
        onMouseLeave,
        onMouseUp,
        onMouseMove
    }
  };
};