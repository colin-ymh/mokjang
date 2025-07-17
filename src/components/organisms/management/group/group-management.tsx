import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import GroupManagementView from '@/components/organisms/management/group/group-management.view';
import { DEFAULT_GROUP, Group } from '@/models/management/management';
import { BLANK } from '@/constants/constant';

type GroupManagementProps = {};

const GroupManagement = ({}: GroupManagementProps) => {
  const { groups } = useSelector((state: RootState) => state.church);

  // 선택된 그룹
  const [selectedGroup, setSelectedGroup] = useState<Group>(DEFAULT_GROUP);

  // 직분 클릭 이벤트
  const onClickGroup = (group: Group) => {
    setSelectedGroup(group);
  };

  // 직분 불러오기
  const fetchGroup = () => {
    if (selectedGroup.id) {
      const newGroup = groups.find((group) => group.id === selectedGroup.id);
      if (newGroup) {
        setSelectedGroup(newGroup);
      }
    } else {
      setSelectedGroup(DEFAULT_GROUP);
    }
  };

  useEffect(() => {
    if (groups && selectedGroup.id !== BLANK && selectedGroup.id !== null) {
      fetchGroup();
    }
  }, [groups]);

  const props = {
    selectedGroup,
    onClickGroup,
  };

  return (
    <>
      <GroupManagementView {...props} />
    </>
  );
};

export default GroupManagement;
