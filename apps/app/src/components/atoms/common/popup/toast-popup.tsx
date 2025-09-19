'use client';

import { useCallback, useEffect, useRef } from 'react';
import gsap from 'gsap';

import ToastPopupView, { TOAST_DIRECTION } from './toast-popup.view';
import { MainTextProps } from '@mokjang/components';
import { setIsToastShown } from '@/redux/reducers/toast-popup-reducer';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';

type ToastPopupProps = MainTextProps & {
  timeout?: number; // ms
  isDeletable?: boolean;
  direction?: TOAST_DIRECTION;
};

const ToastPopup = ({
  timeout = 3000,
  isDeletable = false,
  direction = TOAST_DIRECTION.TOP,
}: ToastPopupProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  // ✅ toastText 변화에도 애니메이션 다시 실행
  const { isToastShown, toastText } = useSelector(
    (s: RootState) => s.toastPopup
  );

  useEffect(() => {
    // 토스트가 보이는 상태가 아니거나 ref가 없으면 실행 안 함
    if (!isToastShown || !ref.current) return;

    // 기존 타임라인 종료
    tlRef.current?.kill();
    tlRef.current = null;

    const ctx = gsap.context(() => {
      const el = ref.current!;
      const isTop = direction === TOAST_DIRECTION.TOP;

      // 초기 위치 세팅
      gsap.set(
        el,
        isTop ? { top: -50, opacity: 0 } : { bottom: -50, opacity: 0 }
      );

      const showKey = isTop
        ? { top: 50, opacity: 1, duration: 0.5 }
        : { bottom: 30, opacity: 1, duration: 0.5 };
      const hideKey = isTop
        ? { top: -50, opacity: 0, duration: 0.5 }
        : { bottom: -50, opacity: 0, duration: 0.5 };

      // 등-대-퇴 타임라인
      const tl = gsap.timeline({
        onComplete: () => {
          // 모든 애니메이션 종료 후 1회만 닫기
          dispatch(setIsToastShown(false));
        },
      });

      const timeoutSec = Math.max(0, timeout) / 1000;

      tl.to(el, showKey) // 등장
        .to({}, { duration: timeoutSec }) // 대기
        .to(el, hideKey); // 퇴장

      tlRef.current = tl;
    }, ref);

    // cleanup
    return () => {
      tlRef.current?.kill();
      tlRef.current = null;
      ctx.revert();
    };
  }, [isToastShown, toastText, direction, timeout, dispatch]); // 👈 toastText 추가

  // 닫기 버튼: 현재 타임라인이 있으면 퇴장 구간으로 점프
  const onClickDeleteButton = useCallback(() => {
    const tl = tlRef.current;
    if (!tl) {
      dispatch(setIsToastShown(false));
      return;
    }
    const total = tl.duration();
    tl.seek(Math.max(0, total - 0.5)).play();
  }, [dispatch]);

  const props = {
    ref,
    timeout,
    isDeletable,
    direction,
    onClickDeleteButton,
  };

  return <ToastPopupView {...props} />;
};

export default ToastPopup;
