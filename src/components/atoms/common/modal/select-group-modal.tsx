import styled from 'styled-components';

import { Group } from '@/models/management/management';
import SelectGroupModalItem from '@/components/atoms/common/modal/select-group-item';
import { BLACK, WHITE } from '@/constants/styles/color';
import { MainText } from '@/components/atoms/common/text/main-text';

import ChevronLeft from '../../../../../public/svg/chevron-left.svg';

const SelectGroupContainer = styled.div`
  display: flex;
  background-color: ${WHITE};
  width: 300px;
  height: 400px;
  border-radius: 5px;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.3);
  flex-direction: column;
  z-index: 400;
`;

const GoBackContainer = styled.div`
  display: flex;
  height: 30px;
  padding: 10px;
  gap: 10px;
  align-items: center;
`;

const GoBackButton = styled(ChevronLeft)`
  width: 20px;
  height: 20px;
  stroke: ${BLACK};
  stroke-width: 1px;
`;

const GroupList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 10px;
`;

type SelectGroupModalProps = {
  groups: Group[];
  currentGroup: Group;
  selectedGroup: Group;
  parentGroups: Group[];
  onClickParent: (group: Group) => void;
  onClickChild: (group: Group) => void;
  onClickCloseDropdown: () => void;
  onClickGoBack: () => void;
};

const SelectGroupModal = ({
  groups,
  currentGroup,
  selectedGroup,
  parentGroups,
  onClickParent,
  onClickChild,
  onClickCloseDropdown,
  onClickGoBack,
}: SelectGroupModalProps) => {
  return (
    <SelectGroupContainer>
      <GoBackContainer>
        <GoBackButton
          onClick={() => parentGroups.length !== 0 && onClickGoBack()}
        />
        <MainText>
          {[...parentGroups, currentGroup]
            .map((parent) => parent.name)
            .join(' > ')}
        </MainText>
      </GoBackContainer>
      <GroupList>
        {groups.map((group) => {
          return (
            <SelectGroupModalItem
              key={group.id}
              group={group}
              onClick={() => {
                if (group.childGroupIds.length === 0) {
                  onClickChild(group);
                  onClickCloseDropdown();
                } else {
                  onClickParent(group);
                }
              }}
            />
          );
        })}
      </GroupList>
    </SelectGroupContainer>
  );
};

export default SelectGroupModal;
