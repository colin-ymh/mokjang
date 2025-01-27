import React, {
  ChangeEvent,
  forwardRef,
  InputHTMLAttributes,
  RefObject,
  useImperativeHandle,
  useRef,
} from 'react';
import BorderInput from '@/components/atoms/common/input/border-input';
import { getFormattedVehicleNumber } from '@/utils/format';
import { MainText } from '@/components/atoms/common/text/main-text';
import Plus from '../../../../public/svg/plus.svg';
import { BLACK, DESTRUCTIVE, MAIN, WHITE } from '@/constants/styles/color';
import styled from 'styled-components';
import { getIsWellFormedVehicleNumber } from '@/utils/check';

const VehicleNumberInputViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 10px;
  transition: all 0.3s ease;
`;

const InputList = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  transition: all 0.3s ease;
`;

const FixedInputItem = styled.div<{ $zIndex: number }>`
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${({ $zIndex }) => $zIndex};
`;

// const InputItem = styled.div<{ $zIndex: number }>`
//   display: none;
//   //width: 0;
//   justify-content: center;
//   align-items: center;
//   z-index: ${({ $zIndex }) => $zIndex};
// `;

const PlusButton = styled(Plus)`
  stroke: ${WHITE};
  stroke-width: 2px;
  background-color: ${MAIN.DEFAULT};
  border-radius: 30px;
  padding: 2px;
`;

export type VehicleNumberInputRef = {
  firstInputRef: RefObject<HTMLInputElement>;
  secondInputRef: RefObject<HTMLInputElement>;
  thirdInputRef: RefObject<HTMLInputElement>;
};

type VehicleNumberInputViewProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  value: string[];
  // count: number;
  onChangeInput: (event: ChangeEvent<HTMLInputElement>, index: number) => void;
  // onClickPlusButton: () => void;
  height?: number;
  width?: number;
};

const VehicleNumberInputView = forwardRef<
  VehicleNumberInputRef,
  VehicleNumberInputViewProps
>(
  (
    {
      label,
      value,
      // count,
      onChangeInput,
      // onClickPlusButton,
      height,
      width,
      ...props
    },
    ref
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

    // const secondAnimationRef = useRef<HTMLDivElement>(null);
    // const thirdAnimationRef = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //   if (count === 2 && secondAnimationRef.current) {
    //     gsap.fromTo(
    //       secondAnimationRef.current,
    //       { x: '-50%', width: '0%', display: 'none' },
    //       {
    //         x: '0%',
    //         width: '32%',
    //         display: 'flex',
    //         duration: 0.3,
    //         ease: 'power1.out',
    //       }
    //     );
    //   }
    //   if (count === 3 && thirdAnimationRef.current) {
    //     gsap.fromTo(
    //       thirdAnimationRef.current,
    //       { x: '-50%', width: '0%', display: 'none' },
    //       {
    //         x: '0%',
    //         width: '32%',
    //         display: 'flex',
    //         duration: 0.3,
    //         ease: 'power1.out',
    //       }
    //     );
    //   }
    // }, [count]);

    return (
      <VehicleNumberInputViewContainer>
        {label && <MainText>{label}</MainText>}
        <InputList>
          <FixedInputItem $zIndex={3}>
            <BorderInput
              ref={firstInputRef}
              value={value[0]}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                onChangeInput(event, 0)
              }
              borderColor={
                value[0]
                  ? getIsWellFormedVehicleNumber(value[0])
                    ? BLACK
                    : DESTRUCTIVE.DEFAULT
                  : undefined
              }
              {...props}
            />
          </FixedInputItem>
          <FixedInputItem
            $zIndex={2}
            // ref={secondAnimationRef}
          >
            <BorderInput
              ref={secondInputRef}
              value={getFormattedVehicleNumber(value[1])}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                onChangeInput(event, 1)
              }
              borderColor={
                value[1]
                  ? getIsWellFormedVehicleNumber(value[1])
                    ? BLACK
                    : DESTRUCTIVE.DEFAULT
                  : undefined
              }
              {...props}
            />
          </FixedInputItem>
          <FixedInputItem
            $zIndex={1}
            // ref={thirdAnimationRef}
          >
            <BorderInput
              ref={thirdInputRef}
              value={getFormattedVehicleNumber(value[2])}
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                onChangeInput(event, 2)
              }
              borderColor={
                value[2]
                  ? getIsWellFormedVehicleNumber(value[2])
                    ? BLACK
                    : DESTRUCTIVE.DEFAULT
                  : undefined
              }
              {...props}
            />
          </FixedInputItem>
          {/*{count < 3 && <PlusButton onClick={onClickPlusButton} />}*/}
        </InputList>
      </VehicleNumberInputViewContainer>
    );
  }
);

export default VehicleNumberInputView;
