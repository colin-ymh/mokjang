// components/molecules/member/information/SelectGroup.tsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { DEFAULT_GROUP, Group } from '@/models/management/management';
import SelectGroupView from './select-group.view';

/* 재귀 검색 유틸 (중복 제거) -------------------------------------- */
const findGroup = (id: string | null, list: Group[]): Group | null => {
  for (const g of list) {
    if (g.id === id) return g;
    if (g.childGroups?.length) {
      const found = findGroup(id, g.childGroups);
      if (found) return found;
    }
  }
  return null;
};

type Props = {
  value: string | null;
  onClickSave: (g: Group) => void;
  onClickClose: () => void;
};

const SelectGroup = ({ value, onClickSave, onClickClose }: Props) => {
  /* ------------------------------------------------------------------
   * Redux
   * ------------------------------------------------------------------ */
  const { groups } = useSelector((s: RootState) => s.church);

  /* ------------------------------------------------------------------
   * 상태
   * ------------------------------------------------------------------ */
  const [allGroups, setAllGroups] = useState<Group[]>([]);
  const [parentGroups, setParentGroups] = useState<Group[]>([]);
  const [currentGroup, setCurrentGroup] = useState<Group>(DEFAULT_GROUP);
  const [selectedGroup, setSelectedGroup] = useState<Group>(DEFAULT_GROUP);

  /* ------------------------------------------------------------------
   * groups 로드 시 초기화
   * ------------------------------------------------------------------ */
  useEffect(() => {
    if (!groups.length) return;
    setAllGroups(groups);
    setCurrentGroup(groups[0]);
  }, [groups]);

  /* ------------------------------------------------------------------
   * value(id) 변경 시 선택 그룹 동기화
   * ------------------------------------------------------------------ */
  useEffect(() => {
    if (value && allGroups.length) {
      const g = findGroup(value, allGroups);
      if (g) setSelectedGroup(g);
    } else {
      setSelectedGroup(DEFAULT_GROUP);
    }
  }, [value, allGroups]);

  /* ------------------------------------------------------------------
   * 자식 목록 & 브레드크럼(breadcrumb)
   * ------------------------------------------------------------------ */
  const currentChildren = currentGroup.childGroups ?? [];

  const breadcrumb = useMemo(() => {
    return currentGroup !== selectedGroup
      ? [...parentGroups, currentGroup, selectedGroup]
      : [...parentGroups, currentGroup];
  }, [parentGroups, currentGroup, selectedGroup]);

  /* ------------------------------------------------------------------
   * 액션: 뒤로가기
   * ------------------------------------------------------------------ */
  const handleGoBack = useCallback(() => {
    setParentGroups((prev) => {
      if (!prev.length) return prev;
      const prevParent = prev[prev.length - 1];
      setCurrentGroup(prevParent);
      return prev.slice(0, -1);
    });
  }, []);

  /* ------------------------------------------------------------------
   * 액션: 그룹(부모) 클릭
   * ------------------------------------------------------------------ */
  const handleEnterGroup = (g: Group) => {
    setSelectedGroup(g);
    if (g.childGroups?.length) {
      setParentGroups((prev) => [...prev, currentGroup]);
      setCurrentGroup(g);
    }
  };

  /* ------------------------------------------------------------------
   * props 모아 전달
   * ------------------------------------------------------------------ */
  return (
    <SelectGroupView
      currentChildren={currentChildren}
      selectedGroup={selectedGroup}
      breadcrumb={breadcrumb}
      hasParent={!!parentGroups.length}
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

export default SelectGroup;
