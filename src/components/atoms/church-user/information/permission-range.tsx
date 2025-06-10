import styled from 'styled-components';
import GroupRangeFilter from '@/components/atoms/church-user/information/group-range-filter';
import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY } from '@/constants/styles/color';
import { Group } from '@/models/management/management';

const PermissionRangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  width: 100%;
  gap: 10px;
`;

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

type PermissionRangeProps = {
  selectedGroupIds: (string | null)[];
  onClickGroup: (group: Group) => void;
};

const PermissionRange = ({
  selectedGroupIds,
  onClickGroup,
}: PermissionRangeProps) => {
  return (
    <PermissionRangeContainer>
      <MainText
        color={GRAY.SEMI_DARK}
      >{`${selectedGroupIds.length}개 선택됨`}</MainText>
      <GroupContainer>
        <GroupRangeFilter
          selectedGroupIds={selectedGroupIds}
          onClickGroup={onClickGroup}
        />
      </GroupContainer>
    </PermissionRangeContainer>
  );
};

export default PermissionRange;
