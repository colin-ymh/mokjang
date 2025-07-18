import styled from 'styled-components';
import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY, MAIN, WHITE } from '@/constants/styles/color';
import { Ministry } from '@/models/management/management';

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
};

const MinistryCountTag = ({ ministry }: MinistryCountTagProps) => {
  return (
    <TagContainer
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
