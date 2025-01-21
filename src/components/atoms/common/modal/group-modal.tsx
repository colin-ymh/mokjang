import { ChangeEvent, useEffect, useState } from 'react';

import { BLANK } from '@/constants/constant';
import GroupModalView from '@/components/atoms/common/modal/group-modal.view';
import { GroupHistory } from '@/models/member/history';
import { DEFAULT_GROUP, Group } from '@/models/management/management';
import { getFormattedDate } from '@/utils/format';
import { getIsWellFormedDate } from '@/utils/check';

type GroupModalProps = {
  prevGroup: GroupHistory;
  onClickClose: () => void;
  onClickSaveNewGroup: (groupId: string, startDate: string) => void;
  onClickSaveEditGroup: (startDate?: string, endDate?: string) => void;
};

const GroupModal = ({
  prevGroup,
  onClickClose,
  onClickSaveNewGroup,
  onClickSaveEditGroup,
}: GroupModalProps) => {
  const isEdit = prevGroup.id !== BLANK;

  // 선택된 그룹
  const [selectedGroup, setSelectedGroup] = useState<Group>(DEFAULT_GROUP);

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
    if (isEdit) {
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

  const props = {
    isEdit,
    prevGroup,
    selectedGroup,
    isButtonEnabled,
    startDate,
    endDate,
    onChangeStartDate,
    onChangeEndDate,
    onClickClose,
    onClickSaveNewGroup,
    onClickSaveEditGroup,
    onClickSaveGroup,
  };

  return (
    <>
      <GroupModalView {...props} />
    </>
  );
};

export default GroupModal;
