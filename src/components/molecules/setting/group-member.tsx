import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import GroupMemberView from '@/components/molecules/setting/group-member.view';
import { MembersApi } from '@/api/churches/members.api';
import { Group } from '@/models/setting/group';

type GroupMemberProps = {
  group: Group;
};

const GroupMember = ({ group }: GroupMemberProps) => {
  const membersApi = new MembersApi(false);
  const { churchId } = useSelector((state: RootState) => state.church);

  const props = {
    group,
  };

  return (
    <>
      <GroupMemberView {...props} />
    </>
  );
};

export default GroupMember;
