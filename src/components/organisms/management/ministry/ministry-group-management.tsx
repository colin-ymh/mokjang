import { useState } from 'react';

import { MINISTRY_MANAGEMENT_HEADER_ID } from '@/constants/layout/header';
import { useMinistryManagementHeaderBarItems } from '@/hooks/layout/header-bar-items';
import {
  DEFAULT_MINISTRY_GROUP,
  MinistryGroup,
} from '@/models/management/management';
import MinistryManagementView from '@/components/organisms/management/ministry/ministry-group-management.view';

type MinistryManagementProps = {};

const MinistryGroupManagement = ({}: MinistryManagementProps) => {
  // 그룹 설정 탭 헤더
  const headerBarItems = useMinistryManagementHeaderBarItems();

  // 선택된 그룹
  const [selectedMinistryGroup, setSelectedMinistryGroup] =
    useState<MinistryGroup>(DEFAULT_MINISTRY_GROUP);

  // 선택된 그룹 정보 탭
  const [headerBarId, setHeaderBarId] = useState<MINISTRY_MANAGEMENT_HEADER_ID>(
    MINISTRY_MANAGEMENT_HEADER_ID.MINISTRY_GROUP_INFORMATION
  );

  // 새로운 탭 이벤트
  const onClickHeaderBar = (id: MINISTRY_MANAGEMENT_HEADER_ID) => {
    setHeaderBarId(id);
  };

  const props = {
    selectedMinistryGroup,
    setSelectedMinistryGroup,
    headerBarId,
    headerBarItems,
    onClickHeaderBar,
  };

  return (
    <>
      <MinistryManagementView {...props} />
    </>
  );
};

export default MinistryGroupManagement;
