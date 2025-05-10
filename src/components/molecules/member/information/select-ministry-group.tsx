// components/molecules/member/information/SelectMinistryGroup.tsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import {
  DEFAULT_MINISTRY_GROUP,
  MinistryGroup,
} from '@/models/management/management';
import SelectMinistryGroupView from './select-ministry-group.view';

/* 재귀 탐색 util -------------------------------------------------- */
const findGroup = (
  id: string | null,
  list: MinistryGroup[]
): MinistryGroup | null => {
  for (const g of list) {
    if (g.id === id) return g;
    if (g.childMinistryGroups?.length) {
      const found = findGroup(id, g.childMinistryGroups);
      if (found) return found;
    }
  }
  return null;
};

type Props = {
  value: string | null;
  onClickSave: (g: MinistryGroup) => void;
  onClickClose: () => void;
};

const SelectMinistryGroup = ({ value, onClickSave, onClickClose }: Props) => {
  /* Redux ---------------------------------------------------------------- */
  const { ministryGroups: rootGroups } = useSelector(
    (s: RootState) => s.church
  );

  /* state ----------------------------------------------------------------- */
  const [allGroups, setAllGroups] = useState<MinistryGroup[]>([]);
  const [parentStack, setParentStack] = useState<MinistryGroup[]>([]);
  const [currentGroup, setCurrentGroup] = useState<MinistryGroup>(
    DEFAULT_MINISTRY_GROUP
  );
  const [selectedGroup, setSelectedGroup] = useState<MinistryGroup>(
    DEFAULT_MINISTRY_GROUP
  );

  /* 초기 로드 ------------------------------------------------------------- */
  useEffect(() => {
    if (!rootGroups.length) return;
    setAllGroups(rootGroups);
    setCurrentGroup(rootGroups[0]); // 최상위(“전체”)로 시작
  }, [rootGroups]);

  /* value 변경 시 선택 그룹 동기화 --------------------------------------- */
  useEffect(() => {
    if (value && allGroups.length) {
      const g = findGroup(value, allGroups);
      if (g) setSelectedGroup(g);
    } else {
      setSelectedGroup(DEFAULT_MINISTRY_GROUP);
    }
  }, [value, allGroups]);

  /* 파생값 ---------------------------------------------------------------- */
  const currentChildren = currentGroup.childMinistryGroups ?? [];
  const breadcrumb = useMemo(
    () =>
      currentGroup !== selectedGroup
        ? [...parentStack, currentGroup, selectedGroup]
        : [...parentStack, currentGroup],
    [parentStack, currentGroup, selectedGroup]
  );

  /* 액션: 뒤로가기 -------------------------------------------------------- */
  const handleGoBack = useCallback(() => {
    setParentStack((ps) => {
      if (!ps.length) return ps;
      const prev = ps[ps.length - 1];
      setCurrentGroup(prev);
      return ps.slice(0, -1);
    });
  }, []);

  /* 액션: 그룹 진입 ------------------------------------------------------- */
  const handleEnterGroup = (g: MinistryGroup) => {
    setSelectedGroup(g);
    if (g.childMinistryGroups?.length) {
      setParentStack((ps) => [...ps, currentGroup]);
      setCurrentGroup(g);
    }
  };

  /* 컨테이너 → View ------------------------------------------------------- */
  return (
    <SelectMinistryGroupView
      currentChildren={currentChildren}
      selectedGroup={selectedGroup}
      breadcrumb={breadcrumb}
      hasParent={!!parentStack.length}
      onGoBack={handleGoBack}
      onEnterGroup={handleEnterGroup}
      onSave={() => {
        onClickSave(selectedGroup);
        onClickClose();
      }}
      onClose={onClickClose}
    />
  );
};

export default SelectMinistryGroup;
