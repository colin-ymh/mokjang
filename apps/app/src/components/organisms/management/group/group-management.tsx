import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';
import GroupManagementView from './group-management.view';
import { DEFAULT_GROUP, Group } from '@mokjang/models';
import { BLANK } from '@mokjang/constants';

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
    if (groups) {
      if (selectedGroup.id !== BLANK && selectedGroup.id !== null) {
        fetchGroup();
      } else if (
        groups.length > 0 &&
        groups[0]?.childGroups &&
        groups[0]?.childGroups.length > 0
      ) {
        // console.log(groups);
        setSelectedGroup(groups[0].childGroups[0]);
      }
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
