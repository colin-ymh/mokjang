import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { MinistryGroup } from '@/models/management/management';

import { useI18n } from '../../../../../locales/client';
import MinistryGroupListView from '@/components/molecules/management/ministry/ministry-group-list.view';
import { MinistryGroupsApi } from '@/api/management/ministry/ministry-groups.api';
import { getOrderedMinistryGroups } from '@/utils/ministry';

type MinistryGroupListProps = {
  selectedMinistryGroupId: string | null;
  setSelectedMinistryGroup: Dispatch<SetStateAction<MinistryGroup>>;
};

const MinistryGroupList = ({
  selectedMinistryGroupId,
  setSelectedMinistryGroup,
}: MinistryGroupListProps) => {
  const t = useI18n();
  const ministryGroupsApi = new MinistryGroupsApi(false);
  const churchId = useSelector((state: RootState) => state.church.churchId);

  // 전체 그룹 배열
  const [ministryGroups, setMinistryGroups] = useState<MinistryGroup[]>([]);

  // 닫혀있는 그룹들
  const [closedMinistryGroups, setClosedMinistryGroups] = useState<Set<number>>(
    new Set()
  );

  // 그룹 불러오기
  const fetchMinistryGroups = () => {
    ministryGroupsApi.getMinistryGroups({ churchId }).then((response) => {
      if (response.status === 200) {
        const orderedMinistryGroups = getOrderedMinistryGroups(response.data);

        // 최상단에 "전체" 그룹을 추가
        const allMinistryGroup: MinistryGroup = {
          id: null, // 고유 ID (임의로 0으로 설정)
          name: t('all'),
          parentMinistryGroupId: null,
          childMinistryGroups: orderedMinistryGroups, // 모든 그룹을 하위 그룹으로 설정
          churchId,
          childMinistryGroupIds: [],
        };

        setMinistryGroups([allMinistryGroup]);
      }
    });
  };

  // 그룹 열고 닫기
  const onClickToggle = (id: string) => {
    const ID = parseInt(id);

    setClosedMinistryGroups((prevClosedMinistryGroups) => {
      const newClosedMinistryGroups = new Set(prevClosedMinistryGroups);
      if (newClosedMinistryGroups.has(ID)) {
        newClosedMinistryGroups.delete(ID); // 이미 닫혀있으면 열기
      } else {
        newClosedMinistryGroups.add(ID); // 닫힌 상태로 추가
      }
      return newClosedMinistryGroups;
    });
  };

  // 교회 정보를 통해 소그룹들 불러오기
  useEffect(() => {
    if (churchId) {
      fetchMinistryGroups();
    }
  }, [churchId]);

  const props = {
    ministryGroups,
    closedMinistryGroups,
    selectedMinistryGroupId,
    setSelectedMinistryGroup,
    fetchMinistryGroups,
    onClickToggle,
  };
  return (
    <>
      <MinistryGroupListView {...props} />
    </>
  );
};

export default MinistryGroupList;
