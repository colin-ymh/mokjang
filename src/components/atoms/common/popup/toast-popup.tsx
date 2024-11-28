import { useEffect, useRef } from "react";
import gsap from "gsap";

import ToastPopupView, {
  TOAST_DIRECTION,
} from "@/components/atoms/common/popup/toast-popup.view";
import { MainTextProps } from "@/components/atoms/common/text/main-text";
import { BLACK, WHITE } from "@/common/styles/color";

type ToastPopupProps = MainTextProps & {
  setIsOpen: (isOpen: boolean) => void;
  text?: string;
  backgroundColor?: string;
  timeout?: number;
  isDeletable?: boolean;
  direction?: TOAST_DIRECTION;
};

const ToastPopup = ({
  setIsOpen,
  text,
  backgroundColor = BLACK,
  timeout = 3000,
  isDeletable = false,
  direction = TOAST_DIRECTION.TOP,
  // text style
  fontSize,
  fontWeight,
  color = WHITE,
}: ToastPopupProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      // 위에서 아래로 등장
      if (direction === TOAST_DIRECTION.TOP) {
        // 등장 애니메이션
        gsap.fromTo(
          ref.current,
          { top: "-50px", opacity: 0 },
          { top: "50px", opacity: 1, duration: 0.5 },
        );

        // 퇴장 애니메이션
        const timer = setTimeout(() => {
          gsap
            .to(ref.current, { top: "-50px", opacity: 0, duration: 0.5 }) // 화면 아래로 이동하며 사라짐
            .then(() => {
              setIsOpen(false);
            });
        }, timeout);

        // 타이머 해제
        return () => clearTimeout(timer);
      }
      // 아래에서 위로 등장
      else {
        // 등장 애니메이션
        gsap.fromTo(
          ref.current,
          { bottom: "-50px", opacity: 0 }, // 시작 상태
          { bottom: "30px", opacity: 1, duration: 0.5 }, // 끝 상태
        );

        // 타임아웃
        const timer = setTimeout(() => {
          // 퇴장 애니메이션
          gsap
            .to(ref.current, { bottom: "-50px", opacity: 0, duration: 0.5 })
            .then(() => {
              setIsOpen(false);
            });
        }, timeout);

        // 타이머 해제
        return () => clearTimeout(timer);
      }
    }
  }, [setIsOpen, direction, timeout]);

  // 닫기 버튼 이벤트
  const onClickDeleteButton = () => {
    setIsOpen(false);
    // 상단 팝업인 경우
    if (direction === TOAST_DIRECTION.TOP) {
      gsap
        .to(ref.current, { top: "-50px", opacity: 0, duration: 0.5 }) // 화면 아래로 이동하며 사라짐
        .then(() => {
          setIsOpen(false);
        });
    }
    // 하단 팝업인 경우
    else {
      gsap
        .to(ref.current, { bottom: "-50px", opacity: 0, duration: 0.5 })
        .then(() => {
          setIsOpen(false);
        });
    }
  };

  const props = {
    ref,
    backgroundColor,
    timeout,
    isDeletable,
    direction,
    onClickDeleteButton,
    //
    text,
    fontSize,
    fontWeight,
    color,
  };
  return (
    <>
      <ToastPopupView {...props} />
    </>
  );
};

export default ToastPopup;
