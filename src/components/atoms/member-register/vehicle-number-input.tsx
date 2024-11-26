import React, {
  InputHTMLAttributes,
  forwardRef,
  useState,
  ChangeEvent,
  useEffect,
} from "react";
import VehicleNumberInputView, {
  VehicleNumberInputRef,
} from "@/components/atoms/member-register/vehicle-number-input.view";

type VehicleNumberInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  value: string[];
  onChangeInput: (event: ChangeEvent<HTMLInputElement>, index: number) => void;
};

const VehicleNumberInput = forwardRef<
  VehicleNumberInputRef,
  VehicleNumberInputProps
>(({ label, value, onChangeInput, ...inputProps }, ref) => {
  // 열려있는 번호 입력 창 개수
  const [count, setCount] = useState<number>(1);

  // 입력 창 추가로 열기 (최대 3개)
  const onClickPlusButton = () => {
    if (count < 3) setCount(count + 1);
  };

  useEffect(() => {
    // 첫 번째 입력값이 완료되었을 때
    if (value[0].length === 4 && count === 1) {
      setCount(2); // 다음 입력창 활성화
    }

    // 두 번째 입력값이 완료되었을 때
    if (value[1]?.length === 4 && count === 2) {
      setCount(3); // 다음 입력창 활성화
    }
  }, [value]);

  useEffect(() => {
    // 첫 번째 입력창 입력 종료 시
    if (value[0].length === 4) {
      // 최초인 경우, 다음 입력창 열기
      if (count === 1) setCount(2);

      // 다음 입력창으로 input focus 변경
      if (typeof ref !== "function" && ref?.current?.secondInputRef?.current) {
        ref.current.secondInputRef.current.focus();
      }
    }

    // 두 번째 입력창 입력 종료 시
    if (value[1].length === 4) {
      // 최초인 경우, 다음 입력창 열기
      if (count === 2) setCount(3);

      // 다음 입력창으로 input focus 변경
      if (typeof ref !== "function" && ref?.current?.thirdInputRef?.current) {
        ref.current.thirdInputRef.current.focus();
      }
    }
  }, [value]);

  useEffect(() => {
    // 다음 ref가 활성화되기 전까지 잠시 대기
    const timer = setTimeout(() => {
      if (typeof ref !== "function") {
        if (count === 2 && ref?.current?.secondInputRef?.current) {
          ref.current.secondInputRef.current.focus();
        }

        if (count === 3 && ref?.current?.thirdInputRef?.current) {
          ref.current.thirdInputRef.current.focus();
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [count, ref]);
  const props = {
    label,
    value,
    count,
    onChangeInput,
    onClickPlusButton,
    ...inputProps,
  };

  return <VehicleNumberInputView ref={ref} {...props} />;
});

export default VehicleNumberInput;
