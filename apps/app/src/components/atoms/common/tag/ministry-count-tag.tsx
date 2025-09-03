import styled from 'styled-components';
import { MainText } from '@mokjang/components';
import { GRAY, MAIN, WHITE } from '@mokjang/constants';
import { Ministry } from '@mokjang/models';

const TagContainer = styled.div<{
  $backgroundColor: string;
  $borderColor: string;
}>`
  display: flex;
  border-radius: 100px;
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  border: 1px solid ${({ $borderColor }) => $borderColor};
  padding: 7px 13px;
  flex-shrink: 0;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  cursor: pointer;
`;

const CountContainer = styled.div`
  display: flex;
  align-items: center;
  border-radius: 100px;
  gap: 5px;
  padding: 2px 8px;
  justify-content: center;
  background-color: ${WHITE};
`;

type MinistryCountTagProps = {
  ministry: Ministry;
  onClick: () => void;
};

const MinistryCountTag = ({ ministry, onClick }: MinistryCountTagProps) => {
  return (
    <TagContainer
      onClick={onClick}
      $backgroundColor={
        ministry.membersCount ? MAIN.EXTRA_LIGHT : GRAY.EXTRA_LIGHT
      }
      $borderColor={ministry.membersCount ? MAIN.LIGHT : GRAY.LIGHT}
    >
      <MainText color={ministry.membersCount ? MAIN.DEFAULT : GRAY.SEMI_DARK}>
        {ministry.name}
      </MainText>
      <CountContainer>
        <MainText color={ministry.membersCount ? MAIN.DEFAULT : GRAY.SEMI_DARK}>
          {ministry.membersCount}
        </MainText>
      </CountContainer>
    </TagContainer>
  );
};

export default MinistryCountTag;
