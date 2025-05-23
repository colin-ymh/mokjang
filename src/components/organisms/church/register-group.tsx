import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import RegisterGroupView from '@/components/organisms/church/register-group.view';
import { DEFAULT_GROUP, Group } from '@/models/management/management';
import { usePageRouter } from '@/utils/router';
import Loading from '@/components/atoms/common/etc/loading';

type GroupListProps = {};

const RegisterGroup = ({}: GroupListProps) => {
  const { groups } = useSelector((state: RootState) => state.church);
  const router = usePageRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 선택된 그룹 (의미 없을수도)
  const [selectedGroup, setSelectedGroup] = useState<Group>(DEFAULT_GROUP);

  // 닫혀있는 그룹들
  const [closedGroups, setClosedGroups] = useState<Set<number>>(new Set());

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

  const props = {
    groups,
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
