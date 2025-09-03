import { useState } from 'react';
import SelectMinistryHierarchyView from './select-ministry-hierarchy.view';

type MinistryGroupFilterProps = {
  isAllSelectable?: boolean;
  isNullable?: boolean;
  isDefaultOpen?: boolean;
  topLevelMinistryGroupId?: string | null;
  prevSelectedMinistryGroupId?: string | null;
  onChange?: (id: string | null) => void;
};

const SelectMinistryHierarchy = ({
  isAllSelectable = true,
  isNullable = false,
  isDefaultOpen = false,
  topLevelMinistryGroupId = null,
  prevSelectedMinistryGroupId,
  onChange,
}: MinistryGroupFilterProps) => {
  // 선택된 그룹 id
  const [selectedMinistryGroupId, setSelectedMinistryGroupId] = useState<
    string | null
  >(prevSelectedMinistryGroupId || null);

  // 새로운 그룹을 설정
  const onClickMinistryGroup = (groupId: string | null) => {
    setSelectedMinistryGroupId(groupId);

    if (onChange) onChange(groupId);
  };

  const props = {
    isAllSelectable,
    isNullable,
    isDefaultOpen,
    topLevelMinistryGroupId,
    selectedMinistryGroupId,
    onClickMinistryGroup,
  };

  return (
    <>
      <SelectMinistryHierarchyView {...props} />
    </>
  );
};

export default SelectMinistryHierarchy;
