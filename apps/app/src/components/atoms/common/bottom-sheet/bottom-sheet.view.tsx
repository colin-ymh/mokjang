import { forwardRef, ReactNode } from 'react';
import styled from 'styled-components';

const BottomSheetContainer = styled.div<{ height: number; $isOpened: boolean }>`
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  right: 0;
  bottom: ${({ $isOpened }) => ($isOpened ? 0 : '-30px')};
  background-color: white;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  height: ${({ height }) => height + 30}px;
  z-index: 1000;
  overflow: scroll;
  touch-action: none;
  pointer-events: auto;
  overscroll-behavior: contain;
`;

const Header = styled.div`
  height: 30px;
  cursor: grab;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const HandleBar = styled.div`
  width: 40px;
  height: 4px;
  background-color: #ccc;
  border-radius: 2px;
`;

const Content = styled.div`
  flex: 1;
  height: 100%;
  overflow-y: auto;
  padding: 16px;

  touch-action: none;
  pointer-events: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
`;

type Props = {
  isOpened: boolean;
  height: number;
  children: ReactNode;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  onTouchStart?: (e: React.TouchEvent<HTMLDivElement>) => void;
};

const BottomSheetView = forwardRef<HTMLDivElement, Props>(
  ({ isOpened, height, children, onMouseDown, onTouchStart }, ref) => {
    return (
      <BottomSheetContainer ref={ref} height={height} $isOpened={isOpened}>
        <Header onMouseDown={onMouseDown} onTouchStart={onTouchStart}>
          <HandleBar />
        </Header>
        <Content>{children}</Content>
      </BottomSheetContainer>
    );
  }
);

export default BottomSheetView;
