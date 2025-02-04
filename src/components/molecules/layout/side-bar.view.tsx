import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { GRAY } from '@/constants/styles/color';
import SideBarButton from '@/components/atoms/layout/side-bar/side-bar-button';
import SideBarHeader from '@/components/atoms/layout/side-bar/side-bar-header';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';
import { HEADER_ID } from '@/constants/layout/header';
import GroupFilter from '@/components/molecules/layout/group-filter';

import { useI18n, useScopedI18n } from '../../../../locales/client';
import Button from '@/components/atoms/common/button/button';

const SideBarContainer = styled.div`
  display: flex; // Flexbox 활성화
  flex-direction: column; // 세로(수직) 방향으로 배치
  height: 100%;

  @media (min-width: ${MEDIA_MIN_WIDTH.MOBILE}) {
    display: none;
  }

  @media (min-width: ${MEDIA_MIN_WIDTH.TABLET}) {
    display: none;
  }

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex; // 데스크탑에서는 Flexbox 사용
    width: 180px;
    background-color: ${GRAY.SIDE_BAR};
    padding: 0 10px;
    border-right: 1px solid ${GRAY.LIGHT};
    overflow: hidden;
    flex-shrink: 0;
    position: relative;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1; // 남은 공간을 모두 차지
  justify-content: flex-start;
`;

const BottomContainer = styled.div`
  display: flex;
  flex-shrink: 0; // 크기를 고정하여 줄어들지 않도록 설정
  //justify-content: center;
  padding: 10px;
`;

const GroupFilterContainer = styled.div<{ $isOpened: boolean }>`
  overflow-y: auto;
  margin: 10px 0;
  display: ${({ $isOpened }) => ($isOpened ? 'flex' : 'none')};
`;

type SideBarViewProps = {
  onClickLogOut: () => void;
};

const SideBarView = ({ onClickLogOut }: SideBarViewProps) => {
  const t = useI18n();
  const t_header = useScopedI18n('header');
  const headerId = useSelector((state: RootState) => state.layout.headerId);

  return (
    <SideBarContainer>
      <SideBarHeader />
      <ButtonContainer>
        <SideBarButton id={HEADER_ID.HOME} title={t_header(HEADER_ID.HOME)} />
        <SideBarButton
          id={HEADER_ID.MEMBER}
          title={t_header(HEADER_ID.MEMBER)}
        />
        <GroupFilterContainer $isOpened={headerId === HEADER_ID.MEMBER}>
          <GroupFilter />
        </GroupFilterContainer>
        <SideBarButton
          id={HEADER_ID.MANAGEMENT}
          title={t(HEADER_ID.MANAGEMENT)}
        />
      </ButtonContainer>
      <BottomContainer>
        <Button
          text={t('button.logOut')}
          onClick={onClickLogOut}
          height={30}
          width={80}
          backgroundColor={GRAY.DEFAULT}
        />
      </BottomContainer>
    </SideBarContainer>
  );
};

export default SideBarView;
