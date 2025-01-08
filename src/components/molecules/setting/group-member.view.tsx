import styled from 'styled-components';
import GroupMemberTable from '@/components/molecules/setting/group-member-table';
import { MainText } from '@/components/atoms/common/text/main-text';
import { GRAY } from '@/constants/styles/color';

import { useScopedI18n } from '../../../../locales/client';
import { Group } from '@/models/setting/group';

const GroupMemberContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ListTypeHeader = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  height: 40px;
  background-color: ${GRAY.SIDE_BAR};
  //border-top: 1px solid ${GRAY.LIGHT};
  justify-content: flex-start;
  align-items: center;
  padding: 0 20px;
`;

type GroupMemberViewProps = {
  group: Group;
};

const GroupMemberView = ({ group }: GroupMemberViewProps) => {
  const t_header = useScopedI18n('header');
  console.log(group);
  return (
    <GroupMemberContainer>
      <ListTypeHeader>
        <MainText color={GRAY.DARK}>{t_header('groupMembers')}</MainText>
        <MainText color={GRAY.DARK}>{`(${group.membersCount})`}</MainText>
      </ListTypeHeader>
      <GroupMemberTable groupMembers={group.members} />
    </GroupMemberContainer>
  );
};

export default GroupMemberView;
