import { Group } from '../../../../models/management/management';
import { MainText } from '../../common/text/main-text';
import styled from 'styled-components';
import { GRAY, MAIN } from '../../../../constants/styles/color';

const GroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const GroupItem = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${GRAY.SEMI_LIGHT};
  padding: 10px;

  &:last-child {
    border-bottom: none;
  }
`;

type SearchedGroupListProps = {
  searchedGroups: Group[];
  selectedGroupIds: (string | null)[];
  onClickGroup: (group: Group) => void;
};

const SearchedGroupList = ({
  searchedGroups,
  selectedGroupIds,
  onClickGroup,
}: SearchedGroupListProps) => {
  return (
    <GroupContainer>
      {searchedGroups.map((group: Group) => (
        <GroupItem key={group.id}>
          <MainText
            color={
              selectedGroupIds.includes(group.id) ? MAIN.DEFAULT : GRAY.DARK
            }
          >
            {group.name}
          </MainText>
        </GroupItem>
      ))}
    </GroupContainer>
  );
};

export default SearchedGroupList;
