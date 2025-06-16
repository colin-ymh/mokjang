import { memo, ReactNode, useCallback, useRef, useState } from 'react';
import SideView from '@/components/molecules/layout/side/side.view';

type SideProps = {
  sideButtonList: ReactNode;
};

const DEFAULT_WIDTH = 180;
const MIN_WIDTH = 100;
const MAX_WIDTH = 300;
const STORAGE_KEY = 'sidebar-width';

const Side = memo(({ sideButtonList }: SideProps) => {
  const [sideBarWidth, setSideBarWidth] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? Number(saved) : DEFAULT_WIDTH;
    }
    return DEFAULT_WIDTH;
  });

  const [isResizing, setIsResizing] = useState<boolean>(false);
  const isResizingRef = useRef<boolean>(false);

  // width 변경 시 localStorage에 저장
  const updateWidth = useCallback((newWidth: number) => {
    setSideBarWidth(newWidth);
    localStorage.setItem(STORAGE_KEY, newWidth.toString());
  }, []);

  const handleMouseMove = useCallback(
    (event: MouseEvent) => {
      if (!isResizingRef.current) return;

      event.preventDefault();
      const newWidth = event.clientX;

      if (MIN_WIDTH <= newWidth && newWidth <= MAX_WIDTH) {
        updateWidth(newWidth);
      }
    },
    [updateWidth]
  );

  const handleMouseUp = useCallback(() => {
    isResizingRef.current = false;
    setIsResizing(false);

    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove, sideBarWidth]);

  const onMouseDown = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault();
      isResizingRef.current = true;
      setIsResizing(true);

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [handleMouseMove, handleMouseUp]
  );

  const onClickOpen = () => setSideBarWidth(DEFAULT_WIDTH);

  const props = {
    sideBarWidth,
    sideButtonList,
    onMouseDown,
    isResizing,
    onClickOpen,
  };

  return <SideView {...props} />;
});

Side.displayName = 'Side';

export default Side;
