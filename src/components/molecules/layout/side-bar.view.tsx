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

const SideBarContainer = styled.div`
  height: 100%;
  // 모바일
  @media (min-width: ${MEDIA_MIN_WIDTH.MOBILE}) {
    display: none;
  }

  // 태블릿
  @media (min-width: ${MEDIA_MIN_WIDTH.TABLET}) {
    display: none;
  }

  // 데스크탑
  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: block;
    flex-direction: column;
    width: 180px;
    background-color: ${GRAY.SIDE_BAR};
    padding: 0 10px;
    //box-shadow: inset -2px 0 5px rgba(0, 0, 0, 0.2);
    border-right: 1px solid ${GRAY.LIGHT};
    height: 100%;
    overflow: hidden;
    flex-shrink: 0;
    position: relative;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex-shrink: 0;
  flex-grow: 1;
  height: 100%;
`;

const GroupFilterContainer = styled.div<{ $isOpened: boolean }>`
  overflow-y: auto;
  margin: 10px 0;
  display: ${({ $isOpened }) => ($isOpened ? 'flex' : 'none')};
`;

const SideBarView = () => {
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
    </SideBarContainer>
  );
};

export default SideBarView;
