import React from 'react';
import styled from 'styled-components';

import HeaderBarView from '@/components/atoms/layout/header/header-bar.view';
import { useTermInformationHeaderBarItems } from '@/hooks/layout/header-bar-items';
import { MainText } from '@/components/atoms/common/text/main-text';
import { SIZE } from '@/constants/styles/style';
import { GRAY } from '@/constants/styles/color';
import { Education, EducationTerm } from '@/models/management/management';

const InformationHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px 20px 0 20px;
  gap: 30px;
`;

const Information = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

export type TermInformationHeaderProps = {
  education: Education;
  term: EducationTerm;
  selectedSessionId: string;
  onClickHeaderItem: (id: string) => void;
};

const TermInformationHeader = ({
  education,
  term,
  selectedSessionId,
  onClickHeaderItem,
}: TermInformationHeaderProps) => {
  const headerBarItems = useTermInformationHeaderBarItems(
    term.educationSessions
  );

  return (
    <InformationHeader>
      <Information>
        <MainText
          size={SIZE.LARGE}
        >{`${education.name} ${term?.term}기`}</MainText>
        <MainText size={SIZE.MEDIUM} color={GRAY.DARK}>
          {term?.instructor.name}
        </MainText>
      </Information>

      {/* 개인정보, 가족 등의 탭 바*/}
      <HeaderBarView
        value={selectedSessionId}
        items={headerBarItems}
        onClick={onClickHeaderItem}
      />
    </InformationHeader>
  );
};

export default TermInformationHeader;
