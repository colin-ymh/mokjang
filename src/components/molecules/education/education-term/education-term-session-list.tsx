import styled from 'styled-components';
import { EducationSession } from '@/models/education/education';
import { MainText } from '@/components/atoms/common/text/main-text';
import React from 'react';
import Plus from '../../../../../public/svg/plus.svg';
import { BLACK, GRAY } from '@/constants/styles/color';
import { useI18n } from '../../../../../locales/client';
import { getStatusColor } from '@/utils/color';

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
  justify-content: space-between;

  cursor: pointer;
  &:hover {
    background-color: ${GRAY.LIGHT};
  }
`;

const LeftContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: row;
`;

const RightContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-start;
  align-items: center;
`;

const ColoredDot = styled.div<{ color: string }>`
  display: flex;
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background-color: ${({ color }) => color};
`;

type EducationTermSessionListProps = {
  educationSessions: EducationSession[];
  onClickAddButton: () => void;
  onClickEducationSessionItem: (
    educationTermId: string,
    educationSessionId: string
  ) => void;
};

const EducationTermSessionList = ({
  educationSessions,
  onClickAddButton,
  onClickEducationSessionItem,
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
        {educationSessions?.map((session) => (
          <SessionItem
            key={session.id}
            onClick={() =>
              onClickEducationSessionItem(session.educationTermId, session.id)
            }
          >
            <LeftContainer>
              <MainText>{`${session.session}${t('session')}`}</MainText>
              <MainText>{session.title}</MainText>
            </LeftContainer>
            <RightContainer>
              <ColoredDot color={getStatusColor(session.status)} />
              <MainText>{t(session.status)}</MainText>
            </RightContainer>
          </SessionItem>
        ))}
      </ListContainer>
    </SessionListContainer>
  );
};

export default EducationTermSessionList;
