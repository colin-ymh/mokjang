import styled from 'styled-components';
import Loading from '@/components/atoms/common/etc/loading';
import React from 'react';
import { WHITE } from '@/constants/styles/color';
import { MEDIA_MIN_WIDTH } from '@/constants/constant';
import EducationTable from '@/components/molecules/education/education/education-table';
import EducationRow from '@/components/molecules/education/education/education-row';

const EducationListContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow-y: auto;
  background-color: ${WHITE};
`;

const MobileView = styled.div`
  display: flex;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: none;
  }
`;

const DesktopView = styled.div`
  display: none;
  justify-content: flex-start;

  @media (min-width: ${MEDIA_MIN_WIDTH.DESKTOP}) {
    display: flex;
    flex-direction: column;
  }
`;

type EducationListViewProps = {
  isLoading: boolean;
  loadEducations: () => void;
};

const EducationListView = ({
  isLoading,
  loadEducations,
}: EducationListViewProps) => {
  return (
    <>
      <EducationListContainer>
        {/* 모바일에서 보일 목록형 UI */}
        {/*<MobileView>*/}
        {/*  <EducationItemList {...props.list} />*/}
        {/*</MobileView>*/}
        {/* 데스크탑에서 보일 테이블형 UI */}
        <DesktopView>
          <EducationRow />
          <EducationTable loadEducations={loadEducations} />
        </DesktopView>
      </EducationListContainer>

      <Loading isShow={isLoading} />
    </>
  );
};

export default EducationListView;
