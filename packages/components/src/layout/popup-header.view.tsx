import styled from 'styled-components';
import { CURSOR, GRAY, MEDIA_MIN_WIDTH, SIZE, WHITE } from '@mokjang/constants';
import { MainText } from '../text';
import { SvgIcon } from '../svg-icon';
import { Svg } from '@mokjang/assets';

/* ───────── 스타일 ───────── */
const HeaderContainer = styled.header<{
  $isHeaderBorderShown: boolean;
  height: number;
}>`
  position: relative;
  z-index: 10;
  overflow: visible;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${({ height }) => `${height}px`};
  flex-shrink: 0;
  background-color: ${WHITE};
  border-bottom: ${({ $isHeaderBorderShown }) =>
    `1px solid ${$isHeaderBorderShown ? GRAY.EXTRA_LIGHT : 'transparent'}`};
`;

const HeaderTitle = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 5px;
  padding-left: 20px;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    justify-content: flex-start;
  }
`;

// 오른쪽 영역: 항상 flex container
const HeaderRight = styled.div`
  display: flex;
  flex: 1;
  padding-right: 10px;
  justify-content: flex-end;
  align-items: center;
`;

const CancelContainer = styled.div`
  display: flex;
  margin-right: 10px;
  cursor: pointer;

  border-radius: 5px;
  transition: background-color 0.1s;
  &:hover {
    background-color: ${GRAY.EXTRA_LIGHT};
  }
`;

/* ───────── 컴포넌트 ───────── */
type PopupHeaderViewProps = {
  headerTitle?: string;
  headerDescription?: string;
  headerLeft?: React.ReactNode;
  headerRight?: React.ReactNode;
  onClickClose: () => void;
  isHeaderBorderShown?: boolean;
  height?: number;
};

export const PopupHeaderView = ({
  headerTitle,
  headerDescription,
  headerLeft,
  headerRight,
  onClickClose,
  isHeaderBorderShown = true,
  height,
}: PopupHeaderViewProps) => {
  return (
    <HeaderContainer
      $isHeaderBorderShown={isHeaderBorderShown}
      height={height ? height : headerDescription ? 80 : 65}
    >
      {headerLeft || (
        <HeaderTitle>
          <MainText size={SIZE.EXTRA_LARGE} fontSize={20}>
            {headerTitle}
          </MainText>
          {headerDescription && (
            <MainText color={GRAY.SEMI_DARK}>{headerDescription}</MainText>
          )}
        </HeaderTitle>
      )}

      <HeaderRight>
        {headerRight || (
          <CancelContainer onClick={onClickClose}>
            <SvgIcon svg={Svg.Cancel} size={22} cursor={CURSOR.POINTER} />
          </CancelContainer>
        )}
      </HeaderRight>
    </HeaderContainer>
  );
};
