// 엔터키 입력 후 포커스 이동 함수
import { RefObject } from "react";

export const onClickEnter = (
  event: React.KeyboardEvent<HTMLInputElement>,
  nextInputRef?: RefObject<HTMLInputElement>,
) => {
  // IME keyCode 무시하기
  if (event.keyCode === 229) return;
  // 엔터키 입력 시
  if (event.key === "Enter") {
    // 다음 입력이 있다면 다음 입력으로
    if (nextInputRef?.current) {
      nextInputRef.current.focus();
    }
    // 없으면 키보드 내리기
    else {
      (event.target as HTMLInputElement).blur();
    }
  }
};
