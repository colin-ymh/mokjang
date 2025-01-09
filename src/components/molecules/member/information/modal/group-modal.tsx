import { ChangeEvent, useEffect, useState } from 'react';

import { BLANK, NULL } from '@/constants/constant';
import { useGroupDropdownItems } from '@/hooks/dropdown/dropdown-items';
import GroupModalView from '@/components/molecules/member/information/modal/group-modal.view';
import { GroupHistory } from '@/models/member/history';
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

  const groupItems = useGroupDropdownItems().filter(
    (item) => item.value !== NULL
  );

  // 선택된 그룹 id
  const [groupId, setGroupId] = useState<string>(
    prevGroup.groupId || groupItems[0].value
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

  // 그룹 드롭다운 변경
  const onChangeGroup = (id: string) => {
    setGroupId(id);
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
      if (getIsWellFormedDate(startDate)) {
        setIsButtonEnabled(true);
      } else {
        setIsButtonEnabled(false);
      }
    }
  }, [startDate, endDate]);

  const props = {
    isEdit,
    groupId,
    groupItems,
    onClickClose,
    startDate,
    endDate,
    isButtonEnabled,
    onChangeGroup,
    onChangeStartDate,
    onChangeEndDate,
    onClickSaveNewGroup,
    onClickSaveEditGroup,
  };

  return (
    <>
      <GroupModalView {...props} />
    </>
  );
};

export default GroupModal;
