import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import BottomSheetView from './bottom-sheet.view';
import { TransparentBackground } from '@mokjang/components';

type BottomSheetProps = {
  isOpened: boolean;
  onDismiss: () => void;
  snapPoints: number[];
  initialSnap?: number;
  isSnapPercentage?: boolean;
  children: ReactNode;
};

const BottomSheet = ({
  isOpened,
  onDismiss,
  snapPoints,
  initialSnap = 0,
  isSnapPercentage = false,
  children,
}: BottomSheetProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const lastY = useRef<number | null>(null);

  const newSnapPoints = useMemo(() => {
    const screenHeight = window.innerHeight;
    const maxHeight = screenHeight - 30;

    const converted = isSnapPercentage
      ? snapPoints
          .filter((p) => p <= 100) // 100% 넘는 값 무시
          .map((p) => Math.min((p / 100) * screenHeight, maxHeight)) // 최대 높이 제한
      : snapPoints;

    return [...converted].sort((a, b) => a - b);
  }, [snapPoints, isSnapPercentage]);

  const initialHeight = useMemo(
    () => (isOpened ? newSnapPoints[initialSnap] : -30),
    [newSnapPoints, initialSnap, isOpened]
  );

  const [height, setHeight] = useState(initialHeight);

  useEffect(() => {
    if (isOpened) {
      setHeight(initialHeight);
    } else {
      setHeight(-30);
    }
  }, [isOpened, initialHeight]);

  useEffect(() => {
    if (height === 0) {
      onDismiss();
    }
  }, [height, onDismiss]);

  const onDrag = useCallback((deltaY: number) => {
    setHeight((prev) => Math.max(0, prev - deltaY));
  }, []);

  const onDragEnd = useCallback(() => {
    lastY.current = null;

    setHeight((prev) => {
      return newSnapPoints.reduce((prevSnap, currSnap) =>
        Math.abs(currSnap - prev) < Math.abs(prevSnap - prev)
          ? currSnap
          : prevSnap
      );
    });
  }, [newSnapPoints]);

  const onMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      lastY.current = e.clientY;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (lastY.current !== null) {
          const deltaY = moveEvent.clientY - lastY.current;
          onDrag(deltaY);
          lastY.current = moveEvent.clientY;
        }
      };

      const handleMouseUp = () => {
        onDragEnd();
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [onDrag, onDragEnd]
  );

  const onTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      lastY.current = e.touches[0].clientY;

      const handleTouchMove = (moveEvent: TouchEvent) => {
        if (lastY.current !== null) {
          const deltaY = moveEvent.touches[0].clientY - lastY.current;
          onDrag(deltaY);
          lastY.current = moveEvent.touches[0].clientY;
        }
      };

      const handleTouchEnd = () => {
        onDragEnd();
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      };

      document.addEventListener('touchmove', handleTouchMove, {
        passive: false,
      });
      document.addEventListener('touchend', handleTouchEnd);
    },
    [onDrag, onDragEnd]
  );

  return (
    <>
      <TransparentBackground isOpened={isOpened} onClick={onDismiss} />
      <BottomSheetView
        ref={ref}
        isOpened={isOpened}
        height={height}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
      >
        {children}
      </BottomSheetView>
    </>
  );
};

export default BottomSheet;
