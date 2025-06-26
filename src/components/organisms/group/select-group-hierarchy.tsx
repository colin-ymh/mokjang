import { useState } from 'react';

import SelectGroupHierarchyView from '@/components/organisms/group/select-group-hierarchy.view';

type GroupFilterProps = {
  isDefaultOpen?: boolean;
  topLevelGroupId?: string | null;
  prevSelectedGroupId?: string | null;
  onChange?: (id: string | null) => void;
};

const SelectGroupHierarchy = ({
  isDefaultOpen = false,
  topLevelGroupId = null,
  prevSelectedGroupId,
  onChange,
}: GroupFilterProps) => {
  // 선택된 그룹 id
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(
    prevSelectedGroupId || null
  );

  // 새로운 그룹을 설정
  const onClickGroup = (groupId: string | null) => {
    setSelectedGroupId(groupId);

    if (onChange) onChange(groupId);
  };

  const props = {
    isDefaultOpen,
    topLevelGroupId,
    selectedGroupId,
    onClickGroup,
  };

  return (
    <>
      <SelectGroupHierarchyView {...props} />
    </>
  );
};

export default SelectGroupHierarchy;
