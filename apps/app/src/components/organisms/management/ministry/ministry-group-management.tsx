import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/store';

import { DEFAULT_MINISTRY_GROUP, MinistryGroup } from '@mokjang/models';
import { BLANK } from '@mokjang/constants';
import MinistryGroupManagementView from './ministry-group-management.view';

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
    if (ministryGroups) {
      if (
        selectedMinistryGroup.id !== BLANK &&
        selectedMinistryGroup.id !== null
      ) {
        fetchMinistryGroup();
      } else if (
        ministryGroups.length > 0 &&
        ministryGroups[0]?.childMinistryGroups &&
        ministryGroups[0]?.childMinistryGroups.length > 0
      ) {
        setSelectedMinistryGroup(ministryGroups[0].childMinistryGroups[0]);
      }
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
