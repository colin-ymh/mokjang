import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import {
  DEFAULT_MINISTRY_GROUP,
  MinistryGroup,
} from '@/models/management/management';
import { BLANK } from '@/constants/constant';
import MinistryGroupManagementView from '@/components/organisms/management/ministry/ministry-group-management.view';

type MinistryGroupManagementProps = {};

const MinistryGroupManagement = ({}: MinistryGroupManagementProps) => {
  const { ministryGroups } = useSelector((state: RootState) => state.church);

  // 선택된 그룹
  const [selectedMinistryGroup, setSelectedMinistryGroup] =
    useState<MinistryGroup>(DEFAULT_MINISTRY_GROUP);

  // 직분 클릭 이벤트
  const onClickMinistryGroup = (ministryGroup: MinistryGroup) => {
    setSelectedMinistryGroup(ministryGroup);
  };

  // 직분 불러오기
  const fetchMinistryGroup = () => {
    if (selectedMinistryGroup.id) {
      const newMinistryGroup = ministryGroups.find(
        (ministryGroup) => ministryGroup.id === selectedMinistryGroup.id
      );
      if (newMinistryGroup) {
        setSelectedMinistryGroup(newMinistryGroup);
      }
    } else {
      setSelectedMinistryGroup(DEFAULT_MINISTRY_GROUP);
    }
  };

  useEffect(() => {
    if (
      ministryGroups &&
      selectedMinistryGroup.id !== BLANK &&
      selectedMinistryGroup.id !== null
    ) {
      fetchMinistryGroup();
    }
  }, [ministryGroups]);

  const props = {
    selectedMinistryGroup,
    onClickMinistryGroup,
  };

  return (
    <>
      <MinistryGroupManagementView {...props} />
    </>
  );
};

export default MinistryGroupManagement;
