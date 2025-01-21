import styled from 'styled-components';
import { Group } from '@/models/management/management';
import { MainText } from '@/components/atoms/common/text/main-text';
import { BLACK, GRAY, MAIN, WHITE } from '@/constants/styles/color';

const BackgroundContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${GRAY.LIGHT};
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
    background-color: ${GRAY.LIGHT};
  }
`;

type GroupDropdownItemProps = {
  group: Group;
  onClick: (group: Group) => void;
  isSelected: boolean;
};

const SelectGroupItem = ({
  group,
  onClick,
  isSelected,
}: GroupDropdownItemProps) => {
  return (
    <BackgroundContainer>
      <ItemContainer onClick={() => onClick(group)}>
        <MainText color={isSelected ? MAIN.DEFAULT : BLACK}>
          {group.name}
        </MainText>
      </ItemContainer>
    </BackgroundContainer>
  );
};

export default SelectGroupItem;
