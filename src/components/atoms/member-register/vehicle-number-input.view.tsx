import React, {
  InputHTMLAttributes,
  forwardRef,
  useRef,
  ChangeEvent,
  useEffect,
  useImperativeHandle,
  RefObject,
} from "react";
import BorderInput from "@/components/atoms/common/input/border-input";
import { getFormattedVehicleNumber } from "@/utils/format";
import gsap from "gsap";
import { MainText } from "@/components/atoms/common/text/main-text";
import Plus from "../../../../public/svg/plus.svg";
import { MAIN, WHITE } from "@/common/styles/color";
import styled from "styled-components";

const VehicleNumberInputViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  transition: all 0.3s ease;
`;

const InputList = styled.div`
  display: flex;
  align-items: center;
  gap: 2%;
  transition: all 0.3s ease;
`;

const FixedInputItem = styled.div<{ $zIndex: number }>`
  display: flex;
  width: 32%;
  justify-content: center;
  align-items: center;
  z-index: ${({ $zIndex }) => $zIndex};
`;

const InputItem = styled.div<{ $zIndex: number }>`
  display: none;
  width: 0;
  justify-content: center;
  align-items: center;
  z-index: ${({ $zIndex }) => $zIndex};
`;

const PlusButton = styled(Plus)`
  stroke: ${WHITE};
  stroke-width: 2px;
  background-color: ${MAIN.DEFAULT};
  border-radius: 30px;
`;

export type VehicleNumberInputRef = {
  firstInputRef: RefObject<HTMLInputElement>;
  secondInputRef: RefObject<HTMLInputElement>;
  thirdInputRef: RefObject<HTMLInputElement>;
};

type VehicleNumberInputViewProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  value: string[];
  count: number;
  onChangeInput: (event: ChangeEvent<HTMLInputElement>, index: number) => void;
  onClickPlusButton: () => void;
};

const VehicleNumberInputView = forwardRef<
  VehicleNumberInputRef,
  VehicleNumberInputViewProps
>(
  (
    { label, value, count, onChangeInput, onClickPlusButton, ...props },
    ref,
  ) => {
    const firstInputRef = useRef<HTMLInputElement>(null);
    const secondInputRef = useRef<HTMLInputElement>(null);
    const thirdInputRef = useRef<HTMLInputElement>(null);

    // 외부에서 ref를 통해 접근할 수 있도록 설정
    useImperativeHandle(ref, () => ({
      firstInputRef,
      secondInputRef,
      thirdInputRef,
    }));

    const secondAnimationRef = useRef<HTMLDivElement>(null);
    const thirdAnimationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (count === 2 && secondAnimationRef.current) {
        gsap.fromTo(
          secondAnimationRef.current,
          { x: "-50%", width: "0%", display: "none" },
          {
            x: "0%",
            width: "32%",
            display: "flex",
            duration: 0.3,
            ease: "power1.out",
          },
        );
      }
      if (count === 3 && thirdAnimationRef.current) {
        gsap.fromTo(
          thirdAnimationRef.current,
          { x: "-50%", width: "0%", display: "none" },
          {
            x: "0%",
            width: "32%",
            display: "flex",
            duration: 0.3,
            ease: "power1.out",
          },
        );
      }
    }, [count]);

    return (
      <VehicleNumberInputViewContainer>
        <MainText>{label}</MainText>
        <InputList>
          <FixedInputItem $zIndex={3}>
            <BorderInput
              ref={firstInputRef}
              value={getFormattedVehicleNumber(value[0])}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                onChangeInput(event, 0)
              }
              {...props}
            />
          </FixedInputItem>
          <InputItem $zIndex={2} ref={secondAnimationRef}>
            <BorderInput
              ref={secondInputRef}
              value={getFormattedVehicleNumber(value[1])}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                onChangeInput(event, 1)
              }
              {...props}
            />
          </InputItem>
          <InputItem $zIndex={1} ref={thirdAnimationRef}>
            <BorderInput
              ref={thirdInputRef}
              value={getFormattedVehicleNumber(value[2])}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                onChangeInput(event, 2)
              }
              {...props}
            />
          </InputItem>
          {count < 3 && <PlusButton onClick={onClickPlusButton} />}
        </InputList>
      </VehicleNumberInputViewContainer>
    );
  },
);

export default VehicleNumberInputView;
