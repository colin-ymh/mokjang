import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { MinistryGroup } from '@/models/management/management';
import MinistryGroupListView from '@/components/molecules/management/ministry/ministry-group-list.view';
import { getOrderedMinistryGroups } from '@/utils/ministry';

import { useI18n } from '../../../../../locales/client';

type MinistryGroupListProps = {
  ministryGroups: MinistryGroup[];
  selectedMinistryGroupId: string | null;
  setSelectedMinistryGroup: Dispatch<SetStateAction<MinistryGroup>>;
  fetchMinistryGroups: () => void;
};

const MinistryGroupList = ({
  ministryGroups,
  selectedMinistryGroupId,
  setSelectedMinistryGroup,
  fetchMinistryGroups,
}: MinistryGroupListProps) => {
  const t = useI18n();
  const churchId = useSelector((state: RootState) => state.church.churchId);

  // 정렬된 사역 그룹
  const [orderedMinistryGroups, setOrderedMinistryGroups] = useState<
    MinistryGroup[]
  >([]);

  // 닫혀있는 그룹들
  const [closedMinistryGroups, setClosedMinistryGroups] = useState<Set<number>>(
    new Set()
  );

  // 그룹 불러오기
  const fetchOrderedMinistryGroups = () => {
    const orderedMinistryGroups = getOrderedMinistryGroups(ministryGroups);

    // 최상단에 "전체" 그룹을 추가
    const allMinistryGroup: MinistryGroup = {
      id: null, // 고유 ID (임의로 0으로 설정)
      name: t('all'),
      parentMinistryGroupId: null,
      childMinistryGroups: orderedMinistryGroups, // 모든 그룹을 하위 그룹으로 설정
      churchId,
      childMinistryGroupIds: [],
    };

    setOrderedMinistryGroups([allMinistryGroup]);
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

  useEffect(() => {
    if (ministryGroups) {
      fetchOrderedMinistryGroups();
    }
  }, [ministryGroups]);

  const props = {
    ministryGroups: orderedMinistryGroups,
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
