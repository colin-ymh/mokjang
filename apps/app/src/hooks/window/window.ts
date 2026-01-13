import { useState, useEffect } from 'react';
import { MEDIA_MIN_WIDTH } from '@mokjang/constants';

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export default useWindowSize;

export const useIsMobile = () => {
  const desktopMinWidth = parseInt(MEDIA_MIN_WIDTH.DESKTOP, 10);

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return true; // ✅ 서버/초기 hydration에서 로고 숨기고 시작(깜빡임 방지)
    return window.innerWidth < desktopMinWidth;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < desktopMinWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [desktopMinWidth]);

  return isMobile;
};
