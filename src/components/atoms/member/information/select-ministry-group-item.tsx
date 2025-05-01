import styled from 'styled-components';
import { MinistryGroup } from '@/models/management/management';
import { MainText } from '@/components/atoms/common/text/main-text';
import { BLACK, GRAY, MAIN, WHITE } from '@/constants/styles/color';

const BackgroundContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${GRAY.SEMI_LIGHT};
  padding: 5px;
`;

const ItemContainer = styled.div`
  display: flex;
  width: 100%;
  height: 30px;
  padding: 5px;
  align-items: center;
  cursor: pointer;
  border-radius: 5px;
  background-color: ${WHITE};
  transition: background-color 0.2s;

  &:hover {
    background-color: ${GRAY.SEMI_LIGHT};
  }
`;

type MinistryGroupDropdownItemProps = {
  ministry: MinistryGroup;
  onClick: (ministry: MinistryGroup) => void;
  isSelected: boolean;
};

const SelectMinistryGroupItem = ({
  ministry,
  onClick,
  isSelected,
}: MinistryGroupDropdownItemProps) => {
  return (
    <BackgroundContainer>
      <ItemContainer onClick={() => onClick(ministry)}>
        <MainText color={isSelected ? MAIN.DEFAULT : BLACK}>
          {ministry.name}
        </MainText>
      </ItemContainer>
    </BackgroundContainer>
  );
};

export default SelectMinistryGroupItem;
