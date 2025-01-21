import { useEffect, useState } from 'react';

import { GROUP_MANAGEMENT_HEADER_ID } from '@/constants/layout/header';
import { useGroupManagementHeaderBarItems } from '@/hooks/layout/header-bar-items';
import GroupManagementView from '@/components/organisms/management/group/group-management.view';
import { DEFAULT_GROUP, Group } from '@/models/management/management';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { GroupsApi } from '@/api/management/group/groups.api';

type GroupManagementProps = {};

const GroupManagement = ({}: GroupManagementProps) => {
  const { churchId, groups } = useSelector((state: RootState) => state.church);
  const groupsApi = new GroupsApi(false);

  // 그룹 설정 탭 헤더
  const headerBarItems = useGroupManagementHeaderBarItems();

  // 선택된 그룹
  const [selectedGroup, setSelectedGroup] = useState<Group>(DEFAULT_GROUP);

  // 선택된 그룹 정보 탭
  const [headerBarId, setHeaderBarId] = useState<GROUP_MANAGEMENT_HEADER_ID>(
    GROUP_MANAGEMENT_HEADER_ID.GROUP_INFORMATION
  );

  // 새로운 탭 이벤트
  const onClickHeaderBar = (id: GROUP_MANAGEMENT_HEADER_ID) => {
    setHeaderBarId(id);
  };

  // 그룹 불러오기
  const fetchGroup = () => {
    groupsApi
      .getGroup({ churchId, groupId: selectedGroup.id as string })
      .then((response) => {
        setSelectedGroup(response.data);
      });
  };

  useEffect(() => {
    if (groups && selectedGroup.id !== null) {
      fetchGroup();
    }
  }, [groups]);

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
