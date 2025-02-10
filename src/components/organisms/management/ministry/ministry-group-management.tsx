import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { MINISTRY_MANAGEMENT_HEADER_ID } from '@/constants/layout/header';
import { useMinistryManagementHeaderBarItems } from '@/hooks/layout/header-bar-items';
import {
  DEFAULT_MINISTRY_GROUP,
  MinistryGroup,
} from '@/models/management/management';
import MinistryManagementView from '@/components/organisms/management/ministry/ministry-group-management.view';
import { MinistryGroupsApi } from '@/api/management/ministry/ministry-groups.api';

type MinistryManagementProps = {};

const MinistryGroupManagement = ({}: MinistryManagementProps) => {
  const ministryGroupsApi = new MinistryGroupsApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);
  // 그룹 설정 탭 헤더
  const headerBarItems = useMinistryManagementHeaderBarItems();

  const [thrownError, setThrownError] = useState<Error | null>(null);
  if (thrownError) {
    throw thrownError;
  }

  // 선택된 그룹
  const [selectedMinistryGroup, setSelectedMinistryGroup] =
    useState<MinistryGroup>(DEFAULT_MINISTRY_GROUP);

  // 전체 그룹 배열
  const [ministryGroups, setMinistryGroups] = useState<MinistryGroup[]>([]);

  // 선택된 그룹 정보 탭
  const [headerBarId, setHeaderBarId] = useState<MINISTRY_MANAGEMENT_HEADER_ID>(
    MINISTRY_MANAGEMENT_HEADER_ID.MINISTRY_GROUP_INFORMATION
  );

  // 새로운 탭 이벤트
  const onClickHeaderBar = (id: MINISTRY_MANAGEMENT_HEADER_ID) => {
    setHeaderBarId(id);
  };

  // 서버에서 사역 그룹을 불러오기
  const fetchMinistryGroups = async () => {
    try {
      await ministryGroupsApi
        .getMinistryGroups({ churchId })
        .then((response) => {
          setMinistryGroups(response.data);
        });
    } catch (error) {
      setThrownError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  // 초기 사역 그룹을 불러옴
  useEffect(() => {
    fetchMinistryGroups();
  }, []);

  // 변화가 발생하면, 사역 그룹을 리렌더링 => 이후 선택된 사역 그룹을 업데이트
  useEffect(() => {
    if (ministryGroups) {
      const newSelectedMinistryGroup = ministryGroups.find(
        (ministryGroup) => ministryGroup.id === selectedMinistryGroup.id
      );

      if (newSelectedMinistryGroup) {
        setSelectedMinistryGroup(newSelectedMinistryGroup);
      }
    }
  }, [ministryGroups]);

  const props = {
    ministryGroups,
    selectedMinistryGroup,
    setSelectedMinistryGroup,
    headerBarId,
    headerBarItems,
    fetchMinistryGroups,
    onClickHeaderBar,
  };

  return (
    <>
      <MinistryManagementView {...props} />
    </>
  );
};

export default MinistryGroupManagement;
