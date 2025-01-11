import { useState } from 'react';

import { GROUP_SETTING_HEADER_ID } from '@/constants/layout/header';
import { useGroupManagementHeaderBarItems } from '@/hooks/layout/header-bar-items';
import GroupManagementView from '@/components/organisms/management/group/group-management.view';
import { DEFAULT_GROUP, Group } from '@/models/management/management';

type GroupManagementProps = {};

const GroupManagement = ({}: GroupManagementProps) => {
  // 그룹 설정 탭 헤더
  const headerBarItems = useGroupManagementHeaderBarItems();

  // 선택된 그룹
  const [selectedGroup, setSelectedGroup] = useState<Group>(DEFAULT_GROUP);

  // 선택된 그룹 정보 탭
  const [headerBarId, setHeaderBarId] = useState<GROUP_SETTING_HEADER_ID>(
    GROUP_SETTING_HEADER_ID.GROUP_INFORMATION
  );

  // 새로운 탭 이벤트
  const onClickHeaderBar = (id: GROUP_SETTING_HEADER_ID) => {
    setHeaderBarId(id);
  };

  const props = {
    selectedGroup,
    setSelectedGroup,
    headerBarId,
    headerBarItems,
    onClickHeaderBar,
  };

  return (
    <>
      <GroupManagementView {...props} />
    </>
  );
};

export default GroupManagement;
