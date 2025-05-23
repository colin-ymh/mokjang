import styled from 'styled-components';
import { EducationSession } from '@/models/education/education';
import { MainText } from '@/components/atoms/common/text/main-text';
import React from 'react';
import Plus from '../../../../../public/svg/plus.svg';
import { BLACK, GRAY } from '@/constants/styles/color';
import { useI18n } from '../../../../../locales/client';

const SessionListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  padding-bottom: 10px;
`;

const PlusButton = styled(Plus)`
  stroke: ${BLACK};
  stroke-width: 1.5px;
  width: 20px;
  height: 20px;
  border-radius: 10%;
  cursor: pointer;
  &:hover {
    background-color: ${GRAY.DEFAULT};
  }
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SessionItem = styled.div`
  display: flex;
  padding: 10px 20px;
  padding-left: 30px;
  border-top: 1px solid ${GRAY.DEFAULT};
`;

type EducationTermSessionListProps = {
  educationSessions: EducationSession[];
  onClickAddButton: () => void;
};

const EducationTermSessionList = ({
  educationSessions,
  onClickAddButton,
}: EducationTermSessionListProps) => {
  const t = useI18n();

  return (
    <SessionListContainer>
      <HeaderContainer>
        <MainText>{t('session')}</MainText>
        <PlusButton onClick={onClickAddButton} />
      </HeaderContainer>
      {/* 회차 목록 */}
      <ListContainer>
        {educationSessions.map((session) => (
          <SessionItem key={session.id}>
            <MainText>{`${session.session}${t('session')}`}</MainText>
          </SessionItem>
        ))}
      </ListContainer>
    </SessionListContainer>
  );
};

export default EducationTermSessionList;
