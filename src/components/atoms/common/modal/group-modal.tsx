import { ChangeEvent, useEffect, useState } from 'react';

import { BLANK } from '@/constants/constant';
import GroupModalView from '@/components/atoms/common/modal/group-modal.view';
import {
  DEFAULT_GROUP,
  Group,
  GroupRole,
} from '@/models/management/management';
import { getFormattedDate } from '@/utils/format';
import { getIsWellFormedDate } from '@/utils/check';
import { DropdownValueType } from '@/components/atoms/common/dropdown/dropdown-item';

type GroupModalProps = {
  isHistory: boolean;
  prevGroup: Group;
  prevGroupRole: GroupRole;
  onClickSaveCurrentGroup?: (groupId: string, startDate: string) => void;
  onClickSaveGroupHistory?: (startDate?: string, endDate?: string) => void;
};

const GroupModal = ({
  isHistory,
  prevGroup,
  prevGroupRole,
  onClickSaveCurrentGroup,
  onClickSaveGroupHistory,
}: GroupModalProps) => {
  // 선택된 그룹
  const [selectedGroup, setSelectedGroup] = useState<Group>(
    prevGroup ? prevGroup : DEFAULT_GROUP
  );

  // 역할 선택지
  const [roleDropdownItems, setRoleDropdownItems] = useState<
    DropdownValueType[]
  >([]);

  // 선택된 역할
  const [selectedRoleId, setSelectedRoleId] = useState<string>(
    prevGroupRole ? prevGroupRole.id : BLANK
  );

  // 시작 날짜
  const [startDate, setStartDate] = useState<string>(
    prevGroup.startDate ? getFormattedDate(prevGroup.startDate) : BLANK
  );

  // 종료 날짜
  const [endDate, setEndDate] = useState<string>(
    prevGroup.endDate ? getFormattedDate(prevGroup.endDate) : BLANK
  );

  // 저장 가능 여부
  const [isButtonEnabled, setIsButtonEnabled] = useState<boolean>(false);

  // 그룹 설정 완료 버튼
  const onClickSaveGroup = (group: Group) => {
    if (group) {
      setSelectedGroup(group);
    }
  };

  // 그룹 설정 완료 버튼
  const onChangeRoleId = (id: string) => {
    if (id) {
      setSelectedRoleId(id);
    }
  };

  // 시작 날짜 변경
  const onChangeStartDate = (event: ChangeEvent<HTMLInputElement>) => {
    const newStartDate = getFormattedDate(event.target.value);
    setStartDate(newStartDate);
  };

  // 종료 날짜 변경
  const onChangeEndDate = (event: ChangeEvent<HTMLInputElement>) => {
    const newEndDate = getFormattedDate(event.target.value);
    setEndDate(newEndDate);
  };

  // 저장 가능 여부 확인
  useEffect(() => {
    if (isHistory) {
      if (
        getIsWellFormedDate(startDate) &&
        (getIsWellFormedDate(endDate) || endDate === BLANK)
      ) {
        setIsButtonEnabled(true);
      } else {
        setIsButtonEnabled(false);
      }
    } else {
      if (selectedGroup.id && getIsWellFormedDate(startDate)) {
        setIsButtonEnabled(true);
      } else {
        setIsButtonEnabled(false);
      }
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (selectedGroup.roles.length > 0) {
      const newItems = selectedGroup.roles.map((role) => {
        return {
          value: role.id,
          title: role.role,
        };
      });

      setRoleDropdownItems(newItems);
    }
  }, [selectedGroup]);

  const props = {
    isHistory,
    prevGroup,
    roleDropdownItems,
    selectedGroup,
    selectedRoleId,
    isButtonEnabled,
    startDate,
    endDate,
    onChangeStartDate,
    onChangeEndDate,
    onClickSaveGroup,
    onChangeRoleId,
    onClickSaveCurrentGroup,
    onClickSaveGroupHistory,
  };

  return (
    <>
      <GroupModalView {...props} />
    </>
  );
};

export default GroupModal;
