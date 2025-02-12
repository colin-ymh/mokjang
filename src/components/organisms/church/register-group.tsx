import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import RegisterGroupView from '@/components/organisms/church/register-group.view';
import { DEFAULT_GROUP, Group } from '@/models/management/management';
import { getOrderedGroups } from '@/utils/group';
import { usePageRouter } from '@/utils/router';

import { useI18n } from '../../../../locales/client';
import Loading from '@/components/atoms/common/etc/loading';

type GroupListProps = {};

const RegisterGroup = ({}: GroupListProps) => {
  const t = useI18n();
  const { churchId, groups } = useSelector((state: RootState) => state.church);
  const router = usePageRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 선택된 그룹 (의미 없을수도)
  const [selectedGroup, setSelectedGroup] = useState<Group>(DEFAULT_GROUP);

  // 전체 그룹 배열
  const [orderedGroups, setOrderedGroups] = useState<Group[]>([]);

  // 닫혀있는 그룹들
  const [closedGroups, setClosedGroups] = useState<Set<number>>(new Set());

  // 그룹 불러오기
  const fetchOrderedGroups = () => {
    // 최상단에 "전체" 그룹을 추가
    const allGroup: Group = {
      id: null, // 고유 ID (임의로 0으로 설정)
      name: t('all'),
      parentGroupId: null,
      childGroups: getOrderedGroups(groups), // 모든 그룹을 하위 그룹으로 설정
      membersCount: 0,
      churchId,
      childGroupIds: [],
      roles: [],
    };

    setOrderedGroups([allGroup]);
  };

  // 그룹 열고 닫기
  const onClickToggle = (id: string) => {
    const ID = parseInt(id);

    setClosedGroups((prevClosedGroups) => {
      const newClosedGroups = new Set(prevClosedGroups);
      if (newClosedGroups.has(ID)) {
        newClosedGroups.delete(ID); // 이미 닫혀있으면 열기
      } else {
        newClosedGroups.add(ID); // 닫힌 상태로 추가
      }
      return newClosedGroups;
    });
  };

  // 다음 설정으로 이동
  const onClickSave = () => {
    setIsLoading(true);
    try {
      router.replace('church/register/officer');
    } finally {
      setIsLoading(false);
    }
  };

  // 교회 정보를 통해 소그룹들 불러오기
  useEffect(() => {
    if (churchId) {
      fetchOrderedGroups();
    }
  }, [churchId, groups]);

  const props = {
    groups: orderedGroups,
    closedGroups,
    selectedGroupId: selectedGroup.id,
    setSelectedGroup: setSelectedGroup,
    onClickToggle,
    onClickSave,
  };

  return (
    <>
      <RegisterGroupView {...props} />
      <Loading isShow={isLoading} />
    </>
  );
};

export default RegisterGroup;
